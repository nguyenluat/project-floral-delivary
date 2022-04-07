$(document).ready(function () {
    toastr.options = {
        closeButton: true,
        debug: true,
        newestOnTop: true,
        progressBar: true,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: 300,
        hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000,
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    $('#dtBasicExample').DataTable();
    $('.dataTables_length').addClass('bs-select');
    
    loadOrder();
});


function loadOrder() {
    $.ajax({
        url: "/Admin/Orders",
        type: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (respose) {
            DataOrderJson = JSON.parse(respose);
            console.log(DataOrderJson);
            var index = 1;
            var indexDetail = 1;
            var rows = ``;
            for (let item of DataOrderJson) {
                let status;
                let convertDateStart = item.dateOfStart.toString("dd/MM/yyyy").split("T")[0];
                switch(item.statusOrderID) {
                    case 1:
                        status = "info";
                        break;
                    case 2:
                        status = "warning";
                        break;
                    case 3:
                        status = "success";
                        break;
                };
                rows += `<tr data-tt-id="${index}">
                    <td>${item.orderID}</td>
                    <td>...</td>
                    <td>${item.tbl_customer.firstName + " " + item.tbl_customer.lastName}</td>
                    <td>${item.tbl_customer.phoneNumber}</td>
                    <td>${item.tbl_customer.address}</td>
                    <td>...</td>
                    <td>${convertDateStart}</td>
                    <td>${item.dateOffinish == null ? " " : item.dateOffinish.toString("dd/MM/yyyy").split("T")[0]}</td>
                    <td>...</td>
                    <td><span class="badge badge-${status}" id="statusOrder" data-status="${status}" data-id="${item.orderID}" style="padding: 0; font-size: 14px; cursor: pointer">${item.tbl_statusOrder.name}</span></td>
                </tr>`;
                for (let itemDetail of item.tbl_orderDetail) {
                    rows += `<tr data-tt-id="${index + "." + indexDetail}" data-tt-parent-id="${index}">
                    <td>...</td>
                    <td>${itemDetail.tbl_product.name}</td>
                    <td>${itemDetail.fullName}</td>
                    <td>${itemDetail.phone}</td>
                    <td>${itemDetail.tbl_ward.name + " - " + itemDetail.tbl_district.name + " - " + itemDetail.address}</td>
                    <td class="text-center">${itemDetail.quantity}</td>
                    <td>${item.dateOffinish == null ? " " : item.dateOffinish.toString("dd/MM/yyyy").split("T")[0]}</td>
                    <td>...</td>
                    <td class="text-center">$${itemDetail.unitPrice}</td>
                    <td></td>
                </tr>`;
                    indexDetail++;
                }
                index++;
            }
            $("#contentOrder").html(rows);
            $("#dtBasicExample").treetable({
                expandable: true
            });
        },
        error: function (respose) {
            window.location.href = "/Home/error404"
        }
    });
};

$(document).on("click", "#statusOrder", function (e) {
    e.preventDefault();

    var status = $(this).data("status");
    $(this).removeClass("badge-" + status).addClass("badge-warning");
    var orderID = $(this).data("id");
    if (status == "info") {
        $.ajax({
            url: "/Admin/updateStatusOrder",
            type: 'POST',
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify({ orderID: orderID }),
            success: function (respose) {
                if (respose == 1) {

                } else {
                    $(this).removeClass("badge-" + status).addClass("badge-warning");
                }
            }
        });
    };
});


