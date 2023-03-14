const express = require("express");
const compression = require("compression");
const YouTubeJS = require("youtubei.js");

const proxyHandler = require("./etc/proxy");
const util = require("./etc/util");

let app = express();
let client;

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
    (error)
    res.status(500).send(error.toString());
  
);

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

initInnerTube();
