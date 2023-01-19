const galleryContainerDiv = document.querySelector('#gallery-container');
// let galleryDataArray = []
let imgName = ""

async function loadGalleryData() {
  const res = await fetch('/fungi_gallery/loadGallery')
  // console.log(res)
  if (res.ok) {
    let data = await res.json();

    // v old

    let galleryData = data.data
    console.log(galleryData)

    //  v new 

    let allGalleryData = data.allData
    console.log(allGalleryData)

    // galleryDataArray = galleryData

    // console.log(data.commentData)

    for (let fungiData of allGalleryData) {
      // console.log(fungiData)

      // !! v upload_by = true (from user)
      
        // console.log("image from user")
        
        let imgId = fungiData.fungi_gallery_id
        imgName = fungiData.image_name
        // console.log(imgName)
        // console.log(fungusImageFileName)


        // !! has commented user
        if (fungiData.username) {
          galleryContainerDiv.innerHTML += `
          <div class="gallery-content" id="gContent${imgId}" index="${imgId}">
            
            <img src="/uploads/${imgName}"
            id="photo">
            
  
            <div class="infoBtn" index="${fungiData.fungus_id}"></div>
          
            <div class="latestCommentContainer" index="${imgId}">
            
            <div class="latestCommentSubContainer">
            <div class="latestUsername">${fungiData.username}:</div>
            <div class="latestCommentOfUser">${fungiData.comment}</div>
            </div>
  
              <div class="commentBtn" index="${imgId}">
              <img src="/img/chat.svg"/>
              </div>      
            </div>
  
          </div>
          `
        } else {

          // !! v no commented user
          galleryContainerDiv.innerHTML += `
          <div class="gallery-content" id="gContent${imgId}" index="${imgId}">
          
            <img src="/uploads/${imgName}"
            id="photo">
            
  
            <div class="infoBtn" index="${fungiData.fungus_id}"></div>
          
            <div class="latestCommentContainer" index="${imgId}">
            
            <div class="latestCommentSubContainer">
            No comment yet
            </div>
  
              <div class="commentBtn" index="${imgId}">
              <img src="/img/chat.svg"/>
              </div>      
            </div>
  
          </div>
          `
          
        }
  

      // v bin

      // let latestCommentDiv = galleryContainerDiv.querySelector('.latestCommentSubContainer')
      // if (fungiData.username) {
      //   console.log(fungiData.username)
      //   latestCommentDiv.innerHTML = `
      //   <div class="latestUsername">${fungiData.username}</div>
      //   <div class="latestCommentOfUser">${fungiData.comment}</div>
      //   `

      // } else if (!fungiData.username) {
      //   console.log(fungiData.username)
      //   latestCommentDiv.innerHTML = `
      //   No comment yet
      //   `

      // }
    }

  }



  addButtonToLoadCommentDiv()

  addButtonForMoreInfo()


}

loadGalleryData()



async function addButtonToLoadCommentDiv() {
  let imagesToClick = document.querySelectorAll('#gallery-container > .gallery-content > .latestCommentContainer > .commentBtn')
  for (let image of imagesToClick) {
    let imageIndex = image.getAttribute('index');
    // console.log(imageIndex)
    image.addEventListener('click', async () => {
      // createTheCommentDivWithTheId() 
      let commentDiv = document.querySelector('.image-comments-container')
      commentDiv.style.display = 'flex'

      let closeBtn = document.querySelector('.closeCommentBtn')
      closeBtn.addEventListener('click', () => {
        commentDiv.style.display = 'none'

      })

      // let imageIndex = image.getAttribute('index');

      const res = await fetch('/fungi_gallery/loadComments', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageIndex }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (res.ok) {

        let data = await res.json()
        // shows the comments and other short info of the image

        // create commenting bar if the user is logged in
        if (data.userId) {
          let userCommentingDiv = document.querySelector('#commentInputForm')
          userCommentingDiv.innerHTML = `
          <input type="text" name="commentInput" imgId="${data.imageId}" userId="${data.userId}">
          </input>

          <button type="submit">comment</button>
          `
        }


        // console.log(data)

        let imgInfo = data.imageInfo[0]
        let fungusName = imgInfo.scientific_name
        let imageName = imgInfo.image_name

        console.log(imgInfo)

        // console.log(imageName)
        // console.log(imageName.indexOf('.'))
        let fileName = imageName.slice(0, imageName.length - 5)
        // console.log(fileName)

        let scNameDiv = commentDiv.querySelector('.scientificName')
        scNameDiv.innerHTML = fungusName

        let imgDiv = commentDiv.querySelector('.commented-image-container')

        let uploaderDiv = commentDiv.querySelector('.photoUploader')
        if (imgInfo.username === null) {

          // uploaderDiv.innerHTML = "System Image"
          // fetch the image from fungi_assets
          uploaderDiv.innerHTML = ""
          
          imgDiv.innerHTML = `
          <img class="commented-image" src="/uploads/${imageName}">
          <div class="reportBtn" reportImage="${imageName}">report
          <i class="bi bi-flag-fill""></i>
          </div>
          `
          // <div class="reportBtn" reportImage="${imageName}">report photo</div>

        } else {

          uploaderDiv.innerHTML = ` Uploaded by user: ${imgInfo.username}`
          // fetch the image from uploads

          imgDiv.innerHTML = `
          <img class="commented-image" src="/uploads/${imageName}">
          <div class="reportBtn" reportImage="${imageName}">report
          <i class="bi bi-flag-fill""></i>
          </div>
          
          `

        }


        // report btn 
        let reportBtnDiv = document.querySelector('.reportBtn')
        reportBtnDiv.addEventListener("click", () => {

          alert("report sent")
        })



        let fungusId = imgInfo.id

        // create anchor with param
        let knowMoreDiv = document.querySelector('.knowMore')
        knowMoreDiv.href = `fungi.html?fungus_id=${fungusId}`


        let commentDataArray = data.comments
        // console.log(commentDataArray)
        console.log(commentDataArray)

        let commentsDiv = document.querySelector('.commentSectionDiv')
        commentsDiv.innerHTML = ""

        if (commentDataArray.length > 0) {

          for (let comment of commentDataArray) {
            commentsDiv.innerHTML += `
            <div class="username-container"> 
            ${comment.username}:
            </div>
  
            <div class="comment-container">
            ${comment.comment}
            </div>
            `
          }


        } else {
          commentsDiv.innerHTML += `
        <div class="comment-container">No comment yet</div>
        `
        }

      }

    })
  }
}

async function addButtonForMoreInfo() {
  let infoBlocksToClick = document.querySelectorAll('#gallery-container > .gallery-content > .infoBtn')
  // console.log(infoBlocksToClick)
  for (let infoBlock of infoBlocksToClick) {
    infoBlock.addEventListener("click", () => {
      let fungusId = infoBlock.getAttribute("index")
      // console.log()
      window.location.href = `
      fungi.html?fungus_id=${fungusId}
      `

    })
  }


}

async function submitComment() {

  const commentForm = document.querySelector("#commentInputForm")
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    // console.log(e.target)
    let commentElement = e.target
    let inputDetails = commentElement.querySelector("input")
    let commentedImageId = inputDetails.getAttribute("imgId")
    let commentingUser = inputDetails.getAttribute("userId")

    // console.log("commenting img id:",commentedImageId)
    let requestObj = {
      imageId: commentedImageId,
      userId: commentingUser,
      comment: commentElement.commentInput.value
    }

    const res = await fetch('/fungi_gallery/postComment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestObj)
    })

    if (res.ok) {

      let data = await res.json()
      // console.log(data.data)

      reloadedComment = data.reload
      // console.log(reloadedComment)

      // extra fetch
      let commentsDiv = document.querySelector('.commentSectionDiv')
        commentsDiv.innerHTML = ""

        if (reloadedComment.length > 0) {

          for (let comment of reloadedComment) {
            commentsDiv.innerHTML += `
            <div class="username-container"> 
            ${comment.username}:
            </div>
  
            <div class="comment-container">
            ${comment.comment}
            </div>
            `
          }


        } else {
          commentsDiv.innerHTML += `
        <div class="comment-container">No comment yet</div>
        `
        }

      // ^ end of extra fetch


    } else {
      alert("failed to send comment")
    }


  })

}

submitComment()
