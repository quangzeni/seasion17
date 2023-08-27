// Thêm dữ liệu để test
let listCatalog = [
    { "catalogId": "C001", "catalogName": "Danh mục 1", "priority": 1, "description": "Mô tả 1", "status": "active" },
    { "catalogId": "C002", "catalogName": "Danh mục 2", "priority": 2, "description": "Mô tả 2", "status": "active" },
    { "catalogId": "C003", "catalogName": "Danh mục 3", "priority": 3, "description": "Mô tả 3", "status": "active" },
    { "catalogId": "C004", "catalogName": "Danh mục 4", "priority": 4, "description": "Mô tả 4", "status": "active" },
    { "catalogId": "C005", "catalogName": "Danh mục 5", "priority": 5, "description": "Mô tả 5", "status": "active" },
    { "catalogId": "C006", "catalogName": "Danh mục 6", "priority": 6, "description": "Mô tả 6", "status": "active" },
    { "catalogId": "C007", "catalogName": "Danh mục 7", "priority": 7, "description": "Mô tả 7", "status": "active" },
    { "catalogId": "C008", "catalogName": "Danh mục 8", "priority": 8, "description": "Mô tả 8", "status": "active" },
    { "catalogId": "C009", "catalogName": "Danh mục 9", "priority": 9, "description": "Mô tả 9", "status": "active" },
    { "catalogId": "C0010", "catalogName": "Danh mục 10", "priority": 10, "description": "Mô tả 10", "status": "active" },
    { "catalogId": "C0011", "catalogName": "Danh mục 11", "priority": 11, "description": "Mô tả 11", "status": "active" },
]
localStorage.setItem("listCatalog", JSON.stringify(listCatalog));

let currentPage = 1;
let recordsPerPage = 3;
let action = "Create";
function renderData(page, listCatalog) {
    // 1. Lấy listCatalog từ localStorage 
    // Trường hợp trong localStorage chưa có key là listCatalog -> khởi tạo listCatalog = []
    // let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Validate page
    let pageMax = getTotalPage(listCatalog);
    if (page < 1) {
        page = 1;
    }
    if (page > pageMax) {
        page = pageMax;
    }
    // 3. Render dữ liệu lên table ở trang page
    // 3.1. truy cập vào phần tử tbody có id là content
    let content = document.getElementById("content");
    content.innerHTML = "";
    // 3.2. Tính toán render dữ liệu lên table từ phần tử nào đến phần tử nào
    let indexMinOnPage = (page - 1) * recordsPerPage;
    let indexMaxOnPage;
    if (page * recordsPerPage > listCatalog.length) {
        indexMaxOnPage = listCatalog.length;
    } else {
        indexMaxOnPage = page * recordsPerPage;
    }
    // 3.3. Render dữ liệu với indexMinOnPage<=index<indexMaxOnPage
    for (let index = indexMinOnPage; index < indexMaxOnPage; index++) {
        content.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${listCatalog[index].catalogId}</td>
                <td>${listCatalog[index].catalogName}</td>
                <td>${listCatalog[index].priority}</td>
                <td>${listCatalog[index].description}</td>
                <td>${listCatalog[index].status}</td>
                <td>
                    <button onclick=initEdit('${listCatalog[index].catalogId}')>Edit</button>
                    <button onclick=deleteCatalog('${listCatalog[index].catalogId}')>Delete</button>
                </td>
            </tr>
        `
    }
    //3.4. Render ra các trang
    let listPages = document.getElementById("listPages");
    listPages.innerHTML = "";
    for (let i = 1; i <= pageMax; i++) {
        listPages.innerHTML += `<li><a href="javascript:clickPage('${i}')">${i}</a></li>`;
    }
    // 3.5. Ẩn hiện Preview và Next
    let preview = document.getElementById("preview");
    let next = document.getElementById("next");
    if (currentPage == 1) {
        preview.style.visibility = "hidden";
    } else {
        preview.style.visibility = "visible";
    }
    if (currentPage == pageMax) {
        next.style.visibility = "hidden";
    } else {
        next.style.visibility = "visible";
    }
}
// Hàm tính tổng số trang trên tổng dữ liệu
function getTotalPage(listCatalog) {
    return Math.ceil(listCatalog.length / recordsPerPage);
}
// Hàm render dữ liệu theo trang khi click vào các trang
function clickPage(page) {
    currentPage = page;
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    renderData(page, listCatalog);
}
// Hàm previewPage
function previewPage() {
    currentPage--;
    // render lại dữ liệu lên table
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    renderData(currentPage, listCatalog);
}
// Hàm nextPage
function nextPage() {
    currentPage++;
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    renderData(currentPage, listCatalog);
}
let btnSave = document.getElementById("btnSave");
btnSave.addEventListener("click", function (event) {
    // Chặn sự kiện mặc định submit form
    event.preventDefault();
    if (action == "Create") {
        createCatalog();
    } else {
        updateCatalog();
    }
})
// Hàm thêm mới một danh mục
function createCatalog() {
    // 1. lấy dữ liệu listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Lấy dữ liệu trên form nhập và đưa vào đối tượng newCatalog
    let newCatalog = getDataForm();
    // 3. Thêm newCatalog vào đầu danh sách
    listCatalog.unshift(newCatalog);
    // 4. set listCatalog vào localStorage
    localStorage.setItem("listCatalog", JSON.stringify(listCatalog));
    // 5. renderData ở trang 1
    renderData(1, listCatalog);
    // 6. reset Form
    resetForm();

}
// Hàm lấy dữ liệu trên inputForm
function getDataForm() {
    let catalogId = document.getElementById("catalogId").value;
    let catalogName = document.getElementById("catalogName").value;
    let priority = document.getElementById("priority").value;
    let description = document.getElementById("description").value;
    let status = document.querySelector("input[type='radio']:checked").value;
    let catalog = { catalogId, catalogName, priority, description, status };
    return catalog;
}
// Hàm resetForm
function resetForm() {
    document.getElementById("catalogId").value = "";
    document.getElementById("catalogName").value = "";
    document.getElementById("priority").value = "";
    document.getElementById("description").value = "";
    document.getElementById("active").checked = true;
}
// Hàm hiển thị thông tin danh mục cần cập nhật lên Input Form
function initEdit(catalogId) {
    // 1. Lấy listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Lấy thông tin danh mục cần cập nhật
    let index = getCatalogById(listCatalog, catalogId);
    // 3. Hiển thị thông tin danh mục cần cập nhật lên Input Form
    document.getElementById("catalogId").value = listCatalog[index].catalogId;
    document.getElementById("catalogId").readOnly = true;
    document.getElementById("catalogName").value = listCatalog[index].catalogName;
    document.getElementById("priority").value = listCatalog[index].priority;
    document.getElementById("description").value = listCatalog[index].description;
    if (listCatalog[index].status == "active") {
        document.getElementById("active").checked = true;
    } else {
        document.getElementById("inActive").checked = true;
    }
    // 4. Đặt lại cờ
    action = "Edit";
}
// Hàm lấy thông tin danh mục theo mã danh mục
function getCatalogById(listCatalog, catalogId) {
    for (let index = 0; index < listCatalog.length; index++) {
        if (listCatalog[index].catalogId == catalogId) {
            return index;
        }
    }
    return -1;
}
// Hàm cập nhật danh mục
function updateCatalog() {
    // 1. Lấy listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Lấy thông tin danh mục sản phẩm từ Input Form
    let updateCatalog = getDataForm();
    // 3. Cập nhật updateCatalog trong listCatalog
    // 3.1. Lấy chỉ số phần tử cần cập nhật
    let index = getCatalogById(listCatalog, updateCatalog.catalogId);
    // 3.2. Cập nhật
    if (index > -1) {
        listCatalog[index] = updateCatalog;
    }
    // 4. set listCatalog vào localStorage
    localStorage.setItem("listCatalog", JSON.stringify(listCatalog));
    // 5. đặt lại cờ action
    action = "Create";
    // 6. resetForm
    resetForm();
    // 7. Đặt lại catalogId readOnly
    document.getElementById("catalogId").readOnly = false;
    // 8. renderData table
    renderData(1, listCatalog);
}
// Hàm xóa danh mục sản phẩm
function deleteCatalog(catalogId) {
    // 1. Lấy dữ liệu listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Xóa catalog trong listCatalog theo catalogId
    let index = getCatalogById(listCatalog, catalogId);
    listCatalog.splice(index, 1);
    // 3. set listCatalog vào localStorage
    localStorage.setItem("listCatalog", JSON.stringify(listCatalog));
    // 4. render Data
    renderData(1, listCatalog);
}
let btnSearch = document.getElementById("btnSearch");
btnSearch.addEventListener("click", function (event) {
    event.preventDefault();
    // 1. Lấy listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 2. Lấy dữ liệu nhập trên ô tìm kiếm
    let catalogNameSearch = document.getElementById("catalogNameSearch").value;
    // 3. tìm các danh mục có tên chứa catalogNameSearch
    // Tìm hiểu về hàm filter
    let listCatalogSearch = listCatalog.filter(catalog => catalog.catalogName.includes(catalogNameSearch));
    // 4. render data
    renderData(1, listCatalogSearch);
})
// Hàm sắp xếp danh mục
function handSortCatalog() {
    // 1. Lấy tiêu chí sắp xếp
    let sortTarget = document.getElementById("sort").value;
    // 2. Lấy listCatalog từ localStorage
    let listCatalog = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
    // 3. Sắp xếp theo các tiêu chí
    switch (sortTarget) {
        case "catalogNameASC":
            // sắp xếp theo tên danh mục tăng dần: sử dụng hàm sort (tìm hiểu thêm)
            listCatalog.sort((a, b) => (a.catalogName > b.catalogName) ? 1 : (a.catalogName < b.catalogName) ? -1 : 0);
            break;
        case "catalogNameDESC":
            // Sắp xếp theo tên danh mục giảm dần
            listCatalog.sort((a, b) => (a.catalogName > b.catalogName) ? -1 : (a.catalogName < b.catalogName) ? 1 : 0);
            break;
        case "priorityASC":
            // Sắp xếp theo độ ưu tiên tăng dần
            listCatalog.sort((a, b) => a.priority - b.priority);
            break;
        case "priorityDESC":
            // Sắp xếp theo độ ưu tiên giảm dần
            listCatalog.sort((a, b) => b.priority - a.priority);
            break;
    }
    // 4. set vào trong localStorage
    localStorage.setItem("listCatalog", JSON.stringify(listCatalog));
    // 5. render Data
    renderData(1, listCatalog);
}
let listCatalogOnload = localStorage.getItem("listCatalog") ? JSON.parse(localStorage.getItem("listCatalog")) : [];
document.onload = renderData(1, listCatalogOnload);