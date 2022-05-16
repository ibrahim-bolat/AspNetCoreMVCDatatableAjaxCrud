var $=jQuery.noConflict();
$(document).ready(function () {
    var tables = $("#userTable").DataTable({
        "pageLength": 10,
        "ordering": true,
        "order": [[0, "asc"]],
        "info": true,
        "paging": true,
        "searching": true,
        "responsive": true,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Tümü"]],
        "pagingType": "full_numbers",
        "processing": true,
        "serverSide": true,
        "filter": true,
        "language": {
            'url': '/lib/datatables/turkceDil.json'
        },
        "ajax": {
            "url": "/User/GetUsers",
            "type": "POST",
            "datatype": "json"
        },
        "columnDefs": [{
            "targets": [0],
            "visible": false,
            "searchable": false
        },
            {
                "targets": [6, 7],
                "searchable": false,
                "orderable": false
            }],
        "columns": [
            {"data": "id", "name": "Id", "autoWidth": true},
            {"data": "firstName", "name": "First Name", "autoWidth": true},
            {"data": "lastName", "name": "Last Name", "autoWidth": true},
            {"data": "contact", "name": "Contact", "autoWidth": true},
            {"data": "email", "name": "Email", "autoWidth": true},
            {"data": "address", "name": "Address", "autoWidth": true},
            {
                "data": "id", "width": "50px", "render": function (data) {
                    return '<a class="btn btn-warning" onclick="return getbyIDforUpdate(' + data + ')"><i class="fa fa-pencil-square-o">Güncelle</i></a>';
                }
            },
            {
                "data": "id", "width": "50px", "render": function (data) {
                    return '<a class="btn btn-danger" onclick="getbyIDforDelete(' + data + ')"><i class="fa fa-trash-o">Sil</i></a>';
                }
            }

        ],
        dom: '<"dt-header"Bf>rt<"dt-footer"ip>',
        buttons: [
            "pageLength",
            {
                extend: 'excelHtml5',
                text: '<i class="fa fa-file-excel-o"> Excel</i>',
                filename: 'Kullanıcı Listesi',
                title: 'Kullanıcı Listesi',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                },
                className: "btn-export-excel"
            },
            {
                extend: 'pdfHtml5',
                text: '<i class="fa fa-file-pdf-o"> Pdf</i>',
                filename: 'Kullanıcı Listesi',
                title: 'Kullanıcı Listesi',
                pageSize: 'A4',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                },
                className: "btn-export-pdf",
                customize: function (doc) {
                    doc.styles.tableHeader.alignment = 'left';
                    doc.content[1].table.widths = [80, 80, 80, '*', 80];
                    var objLayout = {};
                    objLayout['hLineWidth'] = function (i) {
                        return .8;
                    };
                    objLayout['vLineWidth'] = function (i) {
                        return .5;
                    };
                    objLayout['paddingLeft'] = function (i) {
                        return 8;
                    };
                    objLayout['paddingRight'] = function (i) {
                        return 8;
                    };
                    doc.content[1].layout = objLayout;
                },
            },
            {
                extend: 'print',
                text: '<i class="fa fa-file-o"> Yazdır</i>',
                title: 'Kullanıcı Listesi',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                },
                className: "btn-export-print"
            }

        ]
    });
    $(tables.table().body())
        .addClass('tbody');

    //When Close Modal Reset ModelSate Errors and Form inputs
    $(".modal").on("hidden.bs.modal", function () {
        var currentForm = $("#userModal").find('#userForm');
        ResetValidation(currentForm);
        clearTextBox();
        disabledTextBox(false);
    });
});

//Modal Form Create
function Add() {
    var data = $("#userForm").serialize();
    $.ajax({
        url: "/User/Add",
        type: "POST",
        data: data,
        success: function (result) {
            if (result.success) {
                ReloadTable();
                $('#userModal').modal('hide');
                $(".modal-fade").modal("hide");
                $(".modal-backdrop").remove();
                toastMessage(5000, "success", "Kayıt Başarıyla Eklendi")
            } else {
                var mytag=$('<div></div>').html(result);//geriye dönen partial view in 
                $('#userForm > .modal-body').html(mytag.find(".modal-body").html());//sadece body(form) kısmını değiştiriyoruz.
            }
        },
        error: function (errormessage) {
            toastMessage(3000, "error", "Kayıt Eklenemedi")
        }
    });
    return false;
}

//Get User By Id for Update Action and Modal Open
function getbyIDforUpdate(Id) {
    $('#userModalHeaderLabel').text("Kullanıcı Güncelle");
    $('#FirstName').css('border-color', 'lightgrey');
    $('#LastName').css('border-color', 'lightgrey');
    $('#Contact').css('border-color', 'lightgrey');
    $('#Email').css('border-color', 'lightgrey');
    $('#Address').css('border-color', 'lightgrey');
    $.ajax({
        url: '/User/getbyID/' + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ID').val(result.user.id);
            $('#FirstName').val(result.user.firstName);
            $('#LastName').val(result.user.lastName);
            $('#Contact').val(result.user.contact);
            $('#Email').val(result.user.email);
            $('#Address').val(result.user.address);
            $('#btnAdd').hide();
            $('#btnDelete').hide()
            $('#userModalDeleteLabel').hide();
            $('#btnUpdate').show();
            $('#userModal').modal('show');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

//Modal Form Update
function Update() {
    var data = $("#userForm").serialize();
    $.ajax({
        url: "/User/Update",
        type: "POST",
        data: data,
        success: function (result) {
            if (result.success) {
                ReloadTable();
                $('#userModal').modal('hide');
                toastMessage(5000, "success", "Kayıt Başarıyla Güncellendi")
            } else {
                var mytag=$('<div></div>').html(result);//geriye dönen partial view in 
                $('#userForm > .modal-body').html(mytag.find(".modal-body").html());//sadece body(form) kısmını değiştiriyoruz.
            }
        },
        error: function (errormessage) {
            toastMessage(3000, "error", "Kayıt Güncellenemedi")
        }
    });
    return false;
}

//Get User By Id for Delete Action and Modal Open
function getbyIDforDelete(Id) {
    disabledTextBox(true);
    $('#userModalHeaderLabel').text("Kullanıcı Sil");
    $('#FirstName').css('border-color', 'lightgrey');
    $('#LastName').css('border-color', 'lightgrey');
    $('#Contact').css('border-color', 'lightgrey');
    $('#Email').css('border-color', 'lightgrey');
    $('#Address').css('border-color', 'lightgrey');
    $.ajax({
        url: '/User/getbyID/' + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ID').val(result.user.id);
            $('#FirstName').val(result.user.firstName);
            $('#LastName').val(result.user.lastName);
            $('#Contact').val(result.user.contact);
            $('#Email').val(result.user.email);
            $('#Address').val(result.user.address);
            $('#btnAdd').hide();
            $('#btnUpdate').hide();
            $('#btnDelete').show()
            $('#userModalDeleteLabel').show();
            $('#userModal').modal('show');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

//Modal Form Delete
function Delete() {
    var Id = Number($('#ID').val());
    $.ajax({
        url: '/User/Delete/' + Id,
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            if (result.success) {
                ReloadTable();
                $('#userModal').modal('hide');
                toastMessage(5000, "success", "Kayıt Başarıyla Silindi")
            } else {
                toastMessage(3000, "error", "Kayıt Silinemedi")
            }
        },
        error: function (errormessage) {
            toastMessage(3000, "error", "Kayıt Silinemedi")
        }
    });
    return false;
}

//remove ModelSate Errors and reset Form
function ResetValidation(currentForm) {
    currentForm[0].reset();
    currentForm.find("[data-valmsg-summary=true]")
        .removeClass("validation-summary-errors")
        .addClass("validation-summary-valid")
        .find("ul").empty();
    currentForm.find("[data-valmsg-replace=true]")
        .removeClass("field-validation-error")
        .addClass("field-validation-valid")
        .empty();
    currentForm.find("[data-val=true]")
        .removeClass("input-validation-error")
        .addClass("input-validation-valid")
        .empty();
}

//Reset Form inputs (clear form)
function clearTextBox() {
    $('#ID').val("");
    $('#FirstName').val("");
    $('#LastName').val("");
    $('#Contact').val("");
    $('#Email').val("");
    $('#Address').val("");
    $('#btnAdd').show();
    $('#btnUpdate').hide();
    $('#btnDelete').hide();
    $('#userModalDeleteLabel').hide();
    $('#userModalHeaderLabel').text("Kullanıcı Ekle");
    $('#FirstName').css('border-color', 'lightgrey');
    $('#LastName').css('border-color', 'lightgrey');
    $('#Contact').css('border-color', 'lightgrey');
    $('#Email').css('border-color', 'lightgrey');
    $('#Address').css('border-color', 'lightgrey');
}

//When Open Modal for Delete Disabled İnput
function disabledTextBox(value = true) {
    $('#FirstName').attr("disabled", value);
    $('#LastName').attr("disabled", value);
    $('#Contact').attr("disabled", value);
    $('#Email').attr("disabled", value);
    $('#Address').attr("disabled", value);
}

//Databele Reload
function ReloadTable() {
    // $('#example').DataTable().clear();                                                        
    $('#userTable').DataTable().ajax.reload(null,false);
}

//Toast Message Method
function toastMessage(time, icon, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: icon,
        title: message,
    })
}                  