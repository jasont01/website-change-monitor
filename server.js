const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const player = require("play-sound")((opts = {}));

//Express configuration
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;

//Main configuration variables

const sites = [
  nvidia = {
    name: 'Nvida',
    url:
      "https://www.nvidia.com/en-us/geforce/graphics-cards/30-series/rtx-3080/",
    element: "show-out-of-stock",
    invert: true,
  },
  newegg = {
    name: 'NewEgg',
    url:
      "https://www.newegg.com/asus-geforce-rtx-3080-rog-strix-rtx3080-o10g-gaming/p/N82E16814126457",
    element: "product_instock:['1']",
    invert: false,
  },
  amazon = {
      name: 'Amazon',
      url: 'https://www.amazon.com/dp/B08J6F174Z',
      element: 'In Stock.',
      invert: false
  },
  bestbuy_strix = {
      name: 'BestBuy(strix)',
      url: 'https://www.bestbuy.com/site/asus-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-strix-graphics-card-black/6432445.p?skuId=6432445',
      element: 'Sold Out',
      invert: true
  },
  bestbuy_fe = {
      name: 'BestBuy(FE)',
      url: 'https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440',
      element: 'Sold Out',
      invert: true
  },
];

const checkingFrequency = 20 * 1000; //first number represents the checkingFrequency in seconds

//Main function
const intervalId = setInterval(function () {
  console.log('checking sites...');
  sites.forEach((site) => {

    const options = {
        url: site.url,
        headers: {
          "Accept": "application/json, text/plain, */*",
          //"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
          "User-Agent": "axios/0.20.0"
        },
        gzip: true,
      };

    request(options, function (err, response, body) {
      //if the request fails
      if (err) {
        console.log(`Request Error - ${err}`);
      } else {
        //if the target-page content is empty
        if (!body) {
          console.log(`Request Body Error - ${err}`);
        }
        //if the request is successful
        else {
          res = site.invert ? !body.includes(site.element) : body.includes(site.element);
          console.log(`${site.name}: ${res}`);
          if (res) {
            console.log(`\n ** IN STOCK AT ${site.name} **\n`);
            // Alert Notification
            player.play("alarm.mp3", function (err) {
              if (err) throw err;
            });
            clearInterval(intervalId);
          }
        }
      }
    });
  });
}, checkingFrequency);

//Index page render
app.get("/", function (req, res) {
  res.render("index", null);
});

//Server start
app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
