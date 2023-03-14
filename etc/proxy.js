const miniget = require("miniget");
const util = require("./util");

let user_agent = process.env.USER_AGENT || "googlebot";
let client = null;

module.exports = (app) => {
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
