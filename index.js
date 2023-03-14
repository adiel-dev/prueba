const m3u8stream = require("m3u8stream");
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const ytpl = require("ytpl");
const ytcs = require("@freetube/yt-comment-scraper");
const miniget = require("miniget");
const express = require("express");
const ejs = require("ejs");
const app = express();
const videoIDRegex = /^[a-zA-Z0-9-_]{11}$/;

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

let user_agent = process.env.USER_AGENT || "googlebot";
let client = null;

      // If user is seeking a video
      if (req.headers.range) {
        headers.Range = req.headers.range;
      } else {
        headers.Range = "bytes=0-";
      }
/*
      if (streamingData.isHLS) {
        let request = miniget(streamingData.url, {
          headers: {
            "User-Agent": headers["User-Agent"],
          },
        }).on("response", async (r) => {
          ["Content-Type", "Cache-Control"].forEach((hed) => {
            let head = r.headers[hed.toLowerCase()];
            if (head) res.setHeader(hed, head);
          });

          let body = await request.text();

          // Get the URLs
          let urls = body.match(urlreg);
          if (!urls)
            return res.status(500).end(
              JSON.stringify({
                error: {
                  description: "No URL for m3u8 chunks",
                  code: 2,
                },
              })
            );

          infos.HLSOrigin[req.params.id] = [];

          urls.forEach((url) => {
            // We just need the initial host, But not the Segment path
            let splitted = url.split("index.m3u8");

            if (!infos.HLSOrigin[req.params.id].includes(splitted[0]))
              infos.HLSOrigin[req.params.id].push(splitted[0]);

            body = body.replace(
              splitted[0],
              `/hs/${req.params.id}/${
                infos.HLSOrigin[req.params.id].length - 1
              }/`
            );
          });

          res.end(body);
        });

        return;
      }

      if (streamingData.isDashMPD) {
        return m3u8stream(streamingData.url, {
          chunkReadahead: +streamingData.live_chunk_readahead,
          requestOptions: { headers: { "User-Agent": headers["User-Agent"] } },
          parser: streamingData.isDashMPD ? "dash-mpd" : "m3u8",
          id: streamingData.itag,
        })
          .on("error", (err) => {
            res.status(500).end(err.toString());
            console.error(err);
          })
          .pipe(res);
      }
*/
      let h = headers.Range
        ? headers.Range.split(",")[0].split("-")
        : ["bytes=0"];

      if (!streamingData.content_length) {
        streamingData.content_length = await util.getSize(streamingData.url, {
          headers: { "User-Agent": headers["User-Agent"] },
        });
      }

      let beginRange = h[0].startsWith("bytes=") ? h[0].slice(6) : h[0];
      let streamSize = h[1]
        ? parseInt(h[1]) + 1 - beginRange || 1
        : streamingData.content_length - beginRange;
      let isSeeking = req.headers.range ? true : false;

      if (streamSize != streamingData.content_length) isSeeking = true;
      if (parseInt(h[1])) isSeeking = true;

      if (streamingData.content_length) {
        if (!streamSize || parseInt(h[1]) >= streamingData.content_length)
          return res.status(416).end("416 Range Not Satisfiable");
        res
          .status(isSeeking ? 206 : 200)
          .setHeader("Content-Length", streamSize);

        if (isSeeking)
          res.setHeader(
            "Content-Range",
            `bytes ${beginRange}-${
              h[1] || streamingData.content_length - 1
            }/${streamingData.content_length}`
          );

        util.getChunk(
          beginRange,
          req,
          res,
          headers,
          streamingData,
          streamSize,
          isSeeking,
          h
        );
      } else {
        let s = miniget(streamingData.url, { headers })
          .on("error", (err) => {
            if (
              req.connection.destroyed ||
              req.connection.ended ||
              req.connection.closed
            )
              return;
            res.end();
          })
          .on("response", (r) => {
            res.status(r.statusCode);
            [
              "Accept-Ranges",
              "Content-Type",
              "Content-Range",
              "Content-Length",
              "Cache-Control",
            ].forEach((hed) => {
              let head = r.headers[hed.toLowerCase()];
              if (head) res.setHeader(hed, head);
            });

            s.pipe(res);
          });
      }

      res.on("error", (err) => {
        console.error(err);
      });
    } catch (error) {
      console.error(error);
      res.status(500).end(error.toString());
    }
  });
};

module.exports.setClient = newClient => client = newClient;

function clearListener(s, events = ["response", "error", "data", "end"]) {
  events.forEach(i => s.removeAllListeners(i));
}

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

function getChunk(beginRange, req, res, headers, streamingData, streamSize, isSeeking = false, h, headersSetted = false, sentSize = 0, lastConnErr = 0) {
  beginRange = parseInt(beginRange);

  let endRange = beginRange + parseInt(process.env.DLCHUNKSIZE || 1024 * 1024);
  if (endRange > parseInt(h[1]))
    endRange = parseInt(h[1]);
  if (endRange >= streamingData.content_length)
    endRange = "";

  headers.Range = `bytes=${beginRange}-${endRange}`;

  const s = miniget(streamingData.url, { headers })
    .on("response", (r) => {
      if (headersSetted) return;

      ["Accept-Ranges", "Content-Type", "Cache-Control"].forEach((hed) => {
        let head = r.headers[hed.toLowerCase()];
        if (head) res.setHeader(hed, head);
        headersSetted = true;
      });

      lastConnErr = 0;
    })

    .on("error", (err) => {
      clearListener(s);
      console.error(err);
      if (
        req.connection.destroyed ||
        req.connection.ended ||
        req.connection.closed
      )
        return;
      if (
        lastConnErr > 3 ||
        sentSize >= streamSize ||
        sentSize >= streamingData.content_length ||
        beginRange >= endRange
      )
        return res.end();
      getChunk(beginRange + sentSize + 1, req, res, headers, streamingData, streamSize, isSeeking, h, headersSetted, sentSize, lastConnErr);
      lastConnErr++;
    })

    .on("data", (c) => {
      if (
        req.connection.destroyed ||
        req.connection.ended ||
        req.connection.closed
      ) {
        clearListener(s);
        return s.destroy();
      }
      res.write(c);
      res.flush();
      sentSize += c.length;
    })
    .on("end", (_) => {
      clearListener(s);
      if (
        req.connection.destroyed ||
        req.connection.ended ||
        req.connection.closed
      )
        return;
      if (sentSize >= streamSize) {
        return res.end();
      }

      getChunk(endRange + 1, req, res, headers, streamingData, streamSize, isSeeking, h, headersSetted, sentSize, lastConnErr);
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

function sendError(res, error, title = "YouTubeJS error", status = 500, isAPI, code = 2) {
  if (code !== 1) console.error(error);
  try {
    if (isAPI) {
      res.status(status).end(JSON.stringify({
        error: {
          title,
          description: error.toString(),
          code
        }
      }));
    } else {
      res.status(status).render("error.ejs", {
        title,
        content: error,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function validateID(id) {
  return videoIDRegex.test(id.trim());
}

function sendInvalidIDError(res, isAPI) {
  return module.exports.sendError(res, "Your requested video is invalid. Check your URL and try again.", "Invalid Video ID", 400, isAPI, 1);
}

module.exports = { clearListener, getSize, getChunk, getCaptions, sendError, validateID, sendInvalidIDError };


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
