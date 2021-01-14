import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";
// Home

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    if (videos.length === 0) {
      req.flash("error", "We dont have video yet!");
      res.render("home", { pageTitle: "Home", videos, isEmpty: true });
    } else {
      res.render("home", { pageTitle: "Home", videos });
    }
  } catch (error) {
    req.flash("error", "There was an error Loading video");
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// Search

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// Upload

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  console.log(req.file);
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  console.log("created File");
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};
//temp function : for .. of 를 통해 comment에 필요한 정보들을 뽑아옴
const getCommentData = async (vidComments) => {
  const commentData = [];
  for (const item of vidComments) {
    const comment = await Comment.findById(item._id);
    const user = await User.findById(comment.creator);
    commentData.push({
      id: comment.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      text: comment.text,
      creator: comment.creator,
      createdAt: comment.createdAt,
    });
  }
  return commentData;
};
// Video Detail
export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    const commentData = await getCommentData(video.comments);
    res.render("videoDetail", { pageTitle: video.title, video, commentData });
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Edit Video

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    req.flash("error", "you cant edit this video ");
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// Delete Video

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      if (video.comments) {
        console.log(video.comments);
      }
      await Video.findOneAndRemove({ _id: id });
      req.flash("success", "Successfully Deleted Video");
    }
  } catch (error) {
    req.flash("error", "failed to delete video");
    console.log(error);
  }
  res.redirect(routes.home);
};

//Register Video View
export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
export const postAddComment = async (req, res) => {
  //form 을 통해 들어온 정보를 긁어서 DB에 넣고 저장
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    //newComment를 만들고 Video에 추가
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
    const nowUser = await User.findById(user.id);
    nowUser.comments.push(newComment.id);
    nowUser.save();
    const commentData = await getCommentData([newComment]);
    console.log(commentData);
    res.json(commentData);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
export const postDeleteComment = async (req, res) => {
  const {
    params: { id },
    body: { commentid },
  } = req;
  try {
    //id : 댓글을 삭제할 video의 id
    //commentid: 삭제할 댓글의 id
    console.log(`video id : ${id}`);
    console.log(`comment id : ${commentid}`);
    const temp = await Comment.findById(commentid);
    const user = await User.findById(temp.creator);
    const vid = await Video.findById(id);
    user.comments.splice(user.comments.indexOf(commentid));
    user.save();
    vid.comments.splice(vid.comments.indexOf(commentid));
    vid.save();
    const cmt = await Comment.findOneAndRemove({ _id: commentid });
    cmt.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
