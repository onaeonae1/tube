import axios from "axios";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const decreaseNumber = (req, res) => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};
const sendDelete = async (commentid) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/commentdelete`,
    method: "POST",
    data: {
      commentid,
    },
  });
  if (response.status === 200) {
    delComment(commentid);
  }
};
const delComment = (commentid) => {
  //fake
  const target = document.getElementById(commentid);
  const commentsList = target.parentNode;
  commentsList.removeChild(target);
  decreaseNumber();
};
const handleDelete = (event) => {
  const div = event.target.parentElement;
  const targetli = div.parentElement.id;
  sendDelete(targetli);
};
export const initalize = () => {
  console.log("initalize");
  for (var i = 0; i < commentList.children.length; i++) {
    const now = commentList.children.item(i); //li
    const div = now.children.item(0); //div
    const btn = div.children.namedItem("commentDelete"); //button
    if (btn) {
      btn.addEventListener("click", handleDelete);
    }
  }
};
//
const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    console.log(response.data);
    addComment(response.data);
  }
};
const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};
// AJAX 처리 되야함. commentData 긁어오는 기능 필요 -> 외부로 처리해야
const addComment = (comment) => {
  const commentNow = comment[0];
  console.log(commentNow);
  const mainLine = document.createElement("li");
  mainLine.setAttribute("id", commentNow.id);
  const commentBlock = document.createElement("div");
  commentBlock.setAttribute("class", "commentBlock");
  const img = document.createElement("img");
  img.setAttribute("class", "image");
  img.src = commentNow.avatarUrl;
  const createdAt = document.createElement("span");
  createdAt.setAttribute("class", "crated__at");
  createdAt.innerHTML = "Right Now";
  const commentCreator = document.createElement("span");
  commentCreator.setAttribute("class", "comment__creator");
  commentCreator.innerHTML = commentNow.name;
  const commentText = document.createElement("span");
  commentText.setAttribute("class", "comment__text");
  commentText.innerHTML = commentNow.text;
  const commentDelete = document.createElement("button");
  commentDelete.setAttribute("id", "commentDelete");
  commentDelete.setAttribute("class", "deleteButton");
  commentDelete.innerHTML = "❌";
  //add
  commentBlock.appendChild(img);
  commentBlock.appendChild(createdAt);
  commentBlock.appendChild(commentCreator);
  commentBlock.appendChild(commentText);
  commentBlock.appendChild(commentDelete);
  mainLine.appendChild(commentBlock);
  commentList.prepend(mainLine);
  initalize();
  increaseNumber();
};
const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};
function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
if (commentList) {
  initalize();
}
