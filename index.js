const m3u8stream = require("m3u8stream");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const ytcs = require("@freetube/yt-comment-scraper");
const miniget = require("miniget");
const express = require("express");
const ejs = require("ejs");
const app = express();

//        CONFIGURATION        //

// Result Limit
// By default, ytsr & ytpl result limit is 100.
// For ytmous, The search result default is 50.
// Change it as many as you want. 0 for all result without limit.
// The smaller, The faster.
const limit = process.env.LIMIT || 50;

// User Agent
// This is where we fake our request to youtube.
const user_agent =
  process.env.USER_AGENT ||
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36";

//     END OF CONFIGURATION    //

let infos = {
  timeouts: {},
  HLSOrigin: {},
};

function getSize(url, opt) {
  return new Promise((resolv, reject) => {
    let req = miniget(url, opt)
      .on("response", (res) => {
        req.destroy();
        resolv(res.headers["content-length"]);
      })
      .on("error", reject);
  });
}

function getCaptions(id, sub) {
  try {
    let captions =
      infos[id].player_response.captions.playerCaptionsTracklistRenderer
        .captionTracks;
    if (!captions || !captions.length) return [];
    if (!sub) return captions;

    return captions.filter((c) => c.vssId === sub);
  } catch {
    return [];
  }
}

async function getComments(opt) {
  try {
    return await ytcs.getComments(opt);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getCommentReplies(opt) {
  try {
    return await ytcs.getCommentReplies(opt);
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function putInfoToCache(info) {
  if (process.env.NO_CACHE) return;

  let id = info.videoDetails.videoId;
  let timeout = info.player_response.streamingData.expiresInSeconds;

  infos[id] = JSON.parse(JSON.stringify(info));

  if (infos.timeouts[id]) clearTimeout(infos.timeouts[id]);
  infos.timeouts[id] = setTimeout(() => {
    delete infos[id];
  }, parseInt(timeout));

  infos[id].comments = await getComments({ videoId: id });

  return;
}

app.set("views", [__dirname + "/local/views", __dirname + "/views"]);
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/local/public"));
app.use(express.static(__dirname + "/public"));

// Trigger to limit caching
app.use(["/w/*", "/s/*"], (req, res, next) => {
  let IDs = Object.keys(infos);
  if (IDs.length > (process.env.VIDINFO_LIMIT || 20)) {
    delete infos[IDs.shift()];
  }

  next();
});

// Home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Search page
app.get("/s", async (req, res) => {
  let query = req.query.q;
  let page = Number(req.query.p || 1);
  if (!query) return res.redirect("/");
  try {
    res.render("search.ejs", {
      res: await ytsr(query, { limit, pages: page }),
      query: query,
      page,
    });
  } catch (error) {
    console.error(error);
    try {
      res.status(500).render("error.ejs", {
        title: "ytsr Error",
        content: error,
      });
    } catch (error) {
      console.error(error);
    }
  }
});

// Watch Page
app.get("/w/:id", async (req, res) => {
  if (!ytdl.validateID(req.params.id))
    return res.status(400).render("error.ejs", {
      title: "Invalid video ID",
      content: "Your requested video is invalid. Check your URL and try again.",
    });
  try {
    let info = await ytdl.getInfo(req.params.id);

    if (!info.formats.length) {
      return res.status(500).render("error.ejs", {
        title: "Region Lock",
        content: "Sorry. This video is not available for this server country.",
      });
    }

    await putInfoToCache(info);

    res.setHeader("cache-control", "public,max-age=3600");

    res.render("watch.ejs", {
      id: req.params.id,
      info,
      q: req.query,
      captions: getCaptions(req.params.id).map((i) => {
        return {
          name: i.name.simpleText,
          languangeCode: i.languangeCode,
          vssId: i.vssId,
        };
      }),

      comments: infos[req.params.id].comments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error.ejs", {
      title: "ytdl Error",
      content: error,
    });
  }
});

// Embed Page
app.get("/e/:id", async (req, res) => {
  if (!req.params.id) return res.redirect("/");
  try {
    let info = await ytdl.getInfo(req.params.id);
    if (
      !info.formats.filter((format) => format.hasVideo && format.hasAudio)
        .length
    ) {
      return res
        .status(500)
        .send("This Video is not Available for this Server Region.");
    }

    res.render("embed.ejs", {
      id: req.params.id,
      info,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});

// Playlist page
app.get("/p/:id", async (req, res) => {
  if (!req.params.id) return res.redirect("/");
  let page = Number(req.query.p || 1);
  try {
    res.render("playlist.ejs", {
      playlist: await ytpl(req.params.id, { limit, pages: page }),
      page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error.ejs", {
      title: "ytpl Error",
      content: error,
    });
  }
});

// Channel page
app.get("/c/:id", async (req, res) => {
  if (!ytpl.validateID(req.params.id))
    return res.status(400).render("error.ejs", {
      title: "Invalid channel ID",
      content:
        "Your requested channel is invalid. Check your URL and try again.",
    });
  let page = parseInt(req.query.p || 1);
  try {
    res.render("channel.ejs", {
      channel: await ytpl(req.params.id, { limit, pages: page }),
      page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error.ejs", {
      title: "ytpl Error",
      content: error,
    });
  }
});

app.get("/cm/:id", async (req, res) => {
  if (!ytdl.validateID(req.params.id))
    return res.status(400).render("error.ejs", {
      title: "Invalid video ID",
      content:
        "Your requested video comment is invalid. Check your URL and try again.",
    });

  try {
    let opt = {
      videoId: req.params.id,
    };

    if (req.query.continuation) opt.continuation = req.query.continuation;

    let comments;

    if (!req.query.replyToken) {
      comments = await getComments(opt);
    } else {
      opt.replyToken = req.query.replyToken;
      comments = await getCommentReplies(opt);
    }

    comments.comments = comments.comments.map((ch) => {
      ch.authorThumb.map((t) => {
        t.url = "/yt3" + new URL(t.url).pathname;
        return t;
      });

      return ch;
    });

    res.setHeader("cache-control", "public,max-age=3600");

    res.render("comments.ejs", {
      id: req.params.id,
      comments: comments,
      prev: req.params.prev,
      replyToken: req.query.replyToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error.ejs", {
      title: "FreeTube YouTube comment scraper Error",
      content: error,
    });
  }
});

// API Endpoints
if (!process.env.NO_API_ENDPOINTS) {
  app.get("/api/", (req, res) => {
    res.json(["/api/search", "/api/getPlaylistInfo", "/api/getVideoInfo"]);
  });

  app.get("/api/search", async (req, res) => {
    try {
      let result = await ytsr(req.query.q, {
        limit,
        pages: req.query.page || 1,
      });
      delete result.continuation;

      let json = JSON.stringify(result).replace(
        RegExp("https://i.ytimg.com/", "g"),
        "/"
      );
      json = json.replace(RegExp("https://yt3.ggpht.com", "g"), "/yt3");

      // Just make it simple. As long it works.
      res.json(JSON.parse(json));
    } catch (e) {
      res.status(500).end(
        JSON.stringify({
          error: {
            description: e.toString(),
            code: 2,
          },
        })
      );
    }
  });

  app.get("/api/getPlaylistInfo/:id", async (req, res) => {
    if (!ytpl.validateID(req.params.id))
      return res
        .status(400)
        .end(JSON.stringify({ error: { description: "Invalid ID", code: 1 } }));
    try {
      let result = await ytpl(req.params.id, {
        limit,
        pages: req.query.page || 1,
      });
      delete result.continuation;

      let json = JSON.stringify(result).replace(
        RegExp("https://i.ytimg.com/", "g"),
        "/"
      );
      json = json.replace(RegExp("https://yt3.ggpht.com", "g"), "/yt3");

      // Just make it simple. As long it works.
      res.json(JSON.parse(json));
    } catch (e) {
      res.status(500).end(
        JSON.stringify({
          error: {
            description: e.toString(),
            code: 2,
          },
        })
      );
    }
  });

  app.get("/api/getVideoInfo/:id", async (req, res) => {
    if (!ytdl.validateID(req.params.id))
      return res
        .status(400)
        .end(JSON.stringify({ error: { description: "Invalid ID", code: 1 } }));
    try {
      let info = await ytdl.getInfo(req.params.id);
      putInfoToCache(info);

      let json = JSON.stringify({
        ...info.videoDetails,
        related_videos: info.related_videos,
        streams: info.formats.map((i) => {
          i.url = "/s/" + req.params.id + "?itag=" + i.itag;
          return i;
        }),
        captions: getCaptions(req.params.id).map((i) => {
          return {
            name: i.name.simpleText,
            languangeCode: i.languangeCode,
            vssId: i.vssId,
            url: "/cc/" + req.params.id + "?vssId=" + i.vssId,
          };
        }),
      });

      json = json.replace(RegExp("https://i.ytimg.com/", "g"), "/");
      json = json.replace(RegExp("https://yt3.ggpht.com", "g"), "/yt3");

      // Just make it simple. As long it works.
      res.json(JSON.parse(json));
    } catch (e) {
      return res.status(500).end(
        JSON.stringify({
          error: {
            description: e.toString(),
            code: 2,
          },
        })
      );
    }
  });

  app.get("/api/getComments/:id", async (req, res) => {
    if (!ytdl.validateID(req.params.id))
      return res
        .status(400)
        .end(JSON.stringify({ error: { description: "Invalid ID", code: 1 } }));
    let comments = infos[req.params.id] && infos[req.params.id].comments;

    if (!comments || req.query.continuation || req.query.replyToken) {
      try {
        let opt = {
          videoId: req.params.id,
        };

        if (req.query.continuation) opt.continuation = req.query.continuation;

        if (!req.query.replyToken) {
          comments = await getComments(opt);
        } else {
          opt.replyToken = req.query.replyToken;
          comments = await getCommentReplies(opt);
        }

        comments.comments = comments.comments.map((ch) => {
          ch.authorThumb.map((t) => {
            t.url = "/yt3" + new URL(t.url).pathname;
            return t;
          });

          return ch;
        });

        res.json(comments);
      } catch (err) {
        return res.status(500).end(
          JSON.stringify({
            error: {
              description: err.toString(),
              code: 2,
            },
          })
        );
      }
    }
  });
}

// Proxy Area
// This is where we make everything became anonymous

// Video Streaming
app.get("/s/:id", async (req, res) => {
  if (!req.params.id) return res.redirect("/");
  try {
    let info = await ytdl.getInfo(req.params.id);
    info.formats = info.formats.filter(
      (format) => format.hasVideo && format.hasAudio
    );

    if (!info.formats.length) {
      return res
        .status(500)
        .send("This Video is not Available for this Server Region.");
    }

    let headers = {
      "user-agent": user_agent,
    };

    // If user is seeking a video
    if (req.headers.range) {
      headers.range = req.headers.range;
    }

    res.setHeader("content-type", "video/mp4");
    if (info.videoDetails.isLiveContent && info.formats[0].type == "video/ts") {
      return m3u8stream(info.formats[0].url)
        .on("error", (err) => {
          res.status(500).send(err.toString());
          console.error(err);
        })
        .pipe(res);
    }

    let stream = miniget(info.formats[0].url, {
      headers,
    })
      .on("response", (resp) => {
        if (resp.headers["accept-ranges"])
          res.setHeader("accept-ranges", resp.headers["accept-ranges"]);
        if (resp.headers["content-length"])
          res.setHeader("content-length", resp.headers["content-length"]);
        if (resp.headers["content-type"])
          res.setHeader("content-type", resp.headers["content-type"]);
        if (resp.headers["content-range"])
          res.setHeader("content-range", resp.headers["content-range"]);
        if (resp.headers["connection"])
          res.setHeader("connection", resp.headers["connection"]);
        if (resp.headers["cache-control"])
          res.setHeader("cache-control", resp.headers["cache-control"]);
        stream.pipe(res.status(resp.statusCode));
      })
      .on("error", (err) => {
        res.status(500).send(err.toString());
      });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Proxy to i.ytimg.com, Where Video Thumbnail is stored here.
app.get("/vi*", (req, res) => {
  let stream = miniget(`https://i.ytimg.com/${req.url.slice(1)}`, {
    headers: {
      "user-agent": user_agent,
    },
  });
  stream.on("error", (err) => {
    console.log(err);
    res.status(500).send(err.toString());
  });

  stream.on("response", (origin) => {
    res.setHeader("content-type", origin.headers["content-type"]);
    res.setHeader("content-length", origin.headers["content-length"]);
    stream.pipe(res);
  });
});

// Proxy to yt3.ggpht.com, Where User avatar is being stored on that host.
app.get(["/yt3/*", "/ytc/*"], (req, res) => {
  if (req.url.startsWith("/yt3/")) req.url = req.url.slice(4);
  let stream = miniget(`https://yt3.ggpht.com/${req.url.slice(1)}`, {
    headers: {
      "user-agent": user_agent,
    },
  });
  stream.on("error", (err) => {
    console.log(err);
    res.status(500).send(err.toString());
  });

  stream.on("response", (origin) => {
    res.setHeader("content-type", origin.headers["content-type"]);
    res.setHeader("content-length", origin.headers["content-length"]);
    stream.pipe(res);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    title: "404 Not found",
    content: "A resource that you tried to get is not found or deleted.",
  });
});

const listener = app.listen(process.env.PORT || 80, () => {
  console.log("Your app is now listening on port", listener.address().port);
});

// Handle any unhandled promise rejection.
process.on("unhandledRejection", console.error);
