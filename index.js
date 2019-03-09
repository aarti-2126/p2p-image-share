var archive = new DatArchive(window.location);

var uploadImage = function (e) {
    if (e.target.files) {
      const {files} = e.target

      for (let i = 0; i < files.length; i += 1) {
            const reader = new FileReader()
            const file = files[i]

            reader.onload = async function () {
                const targetPath = `/images/${file.name}`
            
                // only write the file if it doesn't already exist
                try {
                    await archive.stat(targetPath)
                } catch (e) {
                    await archive.writeFile(targetPath, reader.result)
                }

                //show image on the page
                appendImage(targetPath);
            }

            reader.readAsArrayBuffer(file)
        }
    }
};

//register callback
document.querySelector('input[type="file"]').addEventListener('change', uploadImage);

var loadAllImages = async function() {
    try {
      const paths = await archive.readdir('images');
      
      for (let i = 0; i < paths.length; i++) {
        const path = `/images/${paths[i]}`;
        appendImage(path);
      }
    } catch (err) {
      console.error(err)
    }
}

var deleteImage = async function(e){

    e.preventDefault();
    e.stopPropagation();

    var deleteEl = e.target;

    var path = deleteEl.getAttribute("data-path");
    // remove from DOM
    var imageEl = document.querySelector(`img[src='${path}']`);

    if( imageEl )
        ( imageEl.parentNode && imageEl.parentNode.remove() ) || imageEl.remove;
    
    // remove from archive
    await archive.unlink(path);
};

var appendImage = function(src){
    
    const listItemEl = document.createElement('li')
    listItemEl.classList.add("image-wrapper");
    //create image
    const img = document.createElement('img')
    img.src = src
    img.height = 500;
    img.width  = 500;

    const deleteLinkEl = document.createElement('div');
    deleteLinkEl.innerHTML = `<a class='delete-image' data-path='${src}'>X Delete</a>`;
    
    listItemEl.appendChild(img);
    listItemEl.appendChild(deleteLinkEl);
    listItemEl.addEventListener("click",deleteImage);

    document.querySelector('.all-images').appendChild(listItemEl)
}

//load all images on page load
loadAllImages();