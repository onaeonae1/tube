# Tube

- cloning youtube with javascript and nodejs

## 설명

- 배포 : [Heroku](https://powerful-mountain-41200.herokuapp.com/)
- 로컬 : npm install 후 npm run dev:server 입력. 그러나 dotenv 문제 있어서 바로 사용은 불가
## Changes

- 비디오 삭제 문제 해결

## TODO

### User

- 다양한 소셜 로그인 추가
- 루트 계정 추가 : 페이지 관리할 수 있도록

### Video

- 비디오 업로드 progress bar 추가 필요.
- 비디오 업로드 때 encoding 해주는 과정이 필요. 이를 통해 전체시간 계산할 수 있게
- 브라우저에 따른 전체화면, 빠른이동(fastseek은 firefox말고 안됨) 문제 개선
- 비디오 삭제시 댓글도 DB에서 삭제

### Comments

- 댓글 기능들 개선 : 수정, 답글, 더 보기 기능
- 댓글 더보기 기능에 대한 구현은 아직 고민 필요.
- mongodb atlas에서 사용하는 시간과 한국 시간의 차이 고려해서 댓글 표현
