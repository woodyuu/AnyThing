const addBtn = document.getElementById("addBtn")
const input = document.getElementById('checkInput')

addBtn.addEventListener("click", addCheck)

//체크리스트 추가
function addCheck(){
    const input = document.getElementById("checkInput")
    const text = input.value.trim()

    const checkList = document.getElementById('checkList')
    const existingItems = checkList.querySelectorAll('li')

    if(text && existingItems.length < 7){
        const listItem = document.createElement("li")
        listItem.textContent = text

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = "Delete"
        deleteBtn.classList.add("deleteBtn")

        listItem.appendChild(deleteBtn)
        document.getElementById("checkList").appendChild(listItem)

        deleteBtn.addEventListener("click", () => {
        listItem.remove()
    })

    listItem.addEventListener("click", () => {
        listItem.classList.toggle("complete")
    })   
    
    input.value = ""
    }
}

//엔터키 눌렀을때 추가 이벤트
input.addEventListener("keydown", function(e){
    console.log(event.keyCode)
    if(e.key === 'Enter'){
        addCheck()
    }
})