import multer from "multer";
import routes from "./routes";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import Video from "./models/Video";
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-2",
});
export const awsDeleteVideo = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  const url = video.fileUrl.split("/");
  const delFileName = url[url.length - 1];
  console.log(url);
  console.log(delFileName);
  const params = {
    Bucket: "tube-onaeoane1/videos",
    Key: delFileName,
  };
  console.log(params);
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log("aws video delete error");
      console.log(err);
      res.redirect(routes.home);
    } else {
      console.log(`aws video delete success ${data}`);
    }
  });
  next();
};
const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "tube-onaeoane1/videos",
  }),
});
const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "tube-onaeoane1/avatars",
  }),
});
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = process.env.PRODUCTION ? "OUR_TUBE" : "DEV_TUBE";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  next();
};
export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};
export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};
export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");
