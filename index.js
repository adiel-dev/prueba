const express = require("express");
const compression = require("compression");
const YouTubeJS = require("youtubei.js");

let user_agent = process.env.USER_AGENT || "googlebot";


let app = express();
let client:

app.use(compression());
app.use(express.static(__dirname + "/local/public"));
app.use(express.static(__dirname + "/public"));

app.set("views", [__dirname + "/local/views", __dirname + "/views"]);
app.set("view engine", "ejs");

// Search page
app.get("/s", async (req, res) => {
  let query = req.query.q;
  let page = parseInt(req.query.p || 1);
  if (!query) return res.redirect("/");
  try {
    res.render("search.ejs", {
      res: await client.search(query),
      query: query,
      page,
    });
  } catch (error) {
    util.sendError(res, error);
  }
});

// Watch Page
app.get("/w/:id", async (req, res) => {
  if (!util.validateID(req.params.id)) return util.sendInvalidIDError(res);
  try {
    res.render("watch.ejs", {
      id: req.params.id,
      info: await client.getInfo(req.params.id),
      comments: null,
      captions: null
    });
  } catch (e) {
    util.sendError(res, error);
  }
});

// Playlist page
app.get("/p/:id", async (req, res) => {
});

// Channel page
app.get("/c/:id", async (req, res) => {
});

app.get("/cm/:id", async (req, res) => {
})

proxyHandler(app);

module.exports = (app) => {
  // Proxy to i.ytimg.com, Where Video Thumbnail is stored here.
  app.get(["/vi*", "/sb/*"], (req, res) => {
    const stream = miniget("https://i.ytimg.com" + req.url, {
      headers: {
        "User-Agent": user_agent,
        Range: req.headers.range || "bytes=0-",
      },
    });
    stream.on("error", (err) => {
      console.log(err);
      res.status(500).end(err.toString());
    });

    stream.on("response", (origin) => {
      res.setHeader("Content-Type", origin.headers["content-type"]);
      res.setHeader("Content-Length", origin.headers["content-length"]);
      stream.pipe(res);
    });
  });

  // Proxy to yt3.ggpht.com, Where User avatar is being stored on that host.
  app.get(["/yt3/*", "/ytc/*"], (req, res) => {
    if (req.url.startsWith("/yt3/")) req.url = req.url.slice(4);
    const stream = miniget("https://yt3.ggpht.com" + req.url, {
      headers: {
        "User-Agent": user_agent,
        Range: req.headers.range || "bytes=0-",
      },
    });

    stream.on("error", (err) => {
      console.log(err);
      res.status(500).end(err.toString());
    });

    stream.on("response", (origin) => {
      res.setHeader("Content-Type", origin.headers["content-type"]);
      res.setHeader("Content-Length", origin.headers["content-length"]);
      stream.pipe(res);
    });
  });

  app.get("/s/:id", async (req, res) => {
    if (!util.validateID(req.params.id)) return res.redirect("/");
    try {
      let streamingData = await client.getStreamingData(req.params.id);
      if (!streamingData.url) streamingData.url = await streamingData.decipher(client.session.player);


/*      let formats = streamingData.filter((format) =>
        req.query.itag
          ? req.query.itag == format.itag
          : format.hasVideo && format.hasAudio
      );

      if (!formats.length) {
        return res.status(500).send("This stream is unavailable.");
      }*/

      let headers = {
        "User-Agent": user_agent,
      };

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

// Handle any unhandled promise rejection.
process.on("unhandledRejection", console.error);



// 404 Handler
app.use((req, res) => {
  res.status(404).render("error.ejs", {
    title: "404 Not found",
    content: "A resource that you tried to get is not found or deleted.",
  });
});

app.on("error", console.error);

async function initInnerTube() {
  console.log("--- Initializing InnerTube Client...");
  try {
    client = await YouTubeJS.Innertube.create();
    console.log("--- InnerTube client ready.");

    proxyHandler.setClient(client);

    const listener = app.listen(process.env.PORT || 3000, () => {
      console.log("-- ytmous is now listening on port", listener.address().port);
    });
  } catch (e) {
    console.error("--- Failed to initialize InnerTube.");
    console.error(e);

    console.log("--- Trying again in 10 seconds....");
    setTimeout(initInnerTube, 10000);
  };
};

// Handle any unhandled promise rejection.
process.on("unhandledRejection", console.error);

initInnerTube();
