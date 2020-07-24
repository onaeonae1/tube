import axios from "axios";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const decreaseNumber = (req, res) => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};
const sendDelete = async (commentid) => {
  console.log(`delete ${commentid}`);
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
  console.log("Delete Event Waiting");
  sendDelete(event.target.parentElement.id);
};
export const initalize = () => {
  console.log("initalize");
  for (var i = 0; i < commentList.children.length; i++) {
    const now = commentList.children.item(i);
    const btn = now.children.namedItem("commentDelete");
    if (btn) {
      btn.addEventListener("click", handleDelete);
      console.log(`event added for ${now.innerHTML}`);
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
const addComment = (comment) => {
  console.log(comment);
  const li = document.createElement("li");
  const span = document.createElement("span");
  const btn = document.createElement("button");
  span.innerHTML = comment.text;
  btn.innerHTML = "❌";
  btn.setAttribute("id", "commentDelete");
  li.setAttribute("id", comment._id);
  li.appendChild(span);
  li.appendChild(btn);
  commentList.prepend(li);
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
