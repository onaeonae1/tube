import axios from "axios";
const commentDelete = document.getElementById("commentDelete");
const commentNumber = document.getElementById("jsCommentNumber");
const commentList = document.getElementById("jsCommentList");
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
  sendDelete(event.target.parentElement.id);
};
export const initalize = () => {
  //초기화
  for (var i = 0; i < commentList.children.length; i++) {
    const now = commentList.children.item(i);
    const btn = now.children.namedItem("commentDelete");
    if (btn) {
      btn.addEventListener("click", handleDelete);
    }
  }
  //commentDelete.addEventListener("click", handleDelete);
};
if (commentList) {
  initalize();
}
