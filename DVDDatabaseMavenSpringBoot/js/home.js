$(document).ready(function () {
    loadDvds();
    showAddForm();
    addDvds();
    updateDvds();
    searchDvds();
});

function clearErrorMessage(){
    $('#errorMessages').empty();
    $('#errorMessagesEdit').empty();
    $('#errorMessagesAdd').empty();
}

function searchDvds() {
    $('#searchButton').click(function (event) {
        clearErrorMessage();

        if(!$('#searchForm').find('input').val() || !$('#category').val()) {
            //alert($('#category').val());
            var message = "Both Search Category and Search Terms are required.";
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
            return false;
        }
        alert($('#category').val());
    });
}

function loadDvds() {
    clearDvdsTable();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'https://tsg-dvds.herokuapp.com/dvds',
        success: function(dvdArray) {
            $.each(dvdArray, function(index, dvd){
                var title = dvd.title;
                var release_date = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var dvdId = dvd.id;
                var notes = dvd.notes;

                var row = '<tr>';
                    row += '<td><a href="#" onclick="showDvdDetail(' + dvdId + ')">'+ title + '</a></td>';
                    row += '<td>' + release_date + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><a href="#" onclick="showEditForm(' + dvdId + ')">Edit</a></td>';
                    row += '<td><a href="#" onclick="deleteDvd(' + dvdId + ')">Delete</a></td>';
                    row += '</tr>';

                contentRows.append(row);
            })
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    });
}

function addDvds() {
    $('#addButton').click(function (event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));

        if(haveValidationErrors) {
            return false;
        }

        $.ajax({
           type: 'POST',
           url: 'https://tsg-dvds.herokuapp.com/dvd',
           data: JSON.stringify({
                title: $('#addTitle').val(),
                releaseYear: $('#addReleaseYear').val(),
                director: $('#addDirector').val(),
                rating: $('#addRating').val(),
                notes: $('#addNotes').val()
           }),
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           },
           'dataType': 'json',
           success: function() {
               clearErrorMessage();
                 $('#addTitle').val(''),
                 $('#addReleaseYear').val(''),
                 $('#addDirector').val(''),
                 $('#addRating').val('G'),
                 $('#addNotes').val('')
               loadDvds();
               hideAddForm();
           },
           error: function (request, status, error) {
               $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
                //alert(request.responseText);
           }
        })
    });
}

function showAddForm() {
    $('#addDvdButton').click(function (event) {

        $('#dvdTableContainerDiv').hide();
        $('#addFormDiv').show();
    });
}

function hideAddForm() {
    clearErrorMessage();

    $('#addTitle').val('');
    $('#addReleaseYear').val('');
    $('#addDirector').val('');
    $('#addRating').val('G');
    $('#addNotes').val('');

    $('#dvdTableContainerDiv').show();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();
}

function clearDvdsTable() {
    $('#contentRows').empty();
}


function hideEditForm() {
    clearErrorMessage();
    $('#editTitle').val('');
    $('#editReleaseYear').val('');
    $('#editDirector').val('');
    $('#editRating').val('G');
    $('#editNotes').val('');

    $('#dvdTableContainerDiv').show();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();

}

function hideDetailForm() {
    clearErrorMessage();

    $('#dvdTableContainerDiv').show();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();
    $('#dvdDetail').hide();

}
function showEditForm(dvdId) {
    clearErrorMessage();
    $('#editTitlePage').text("Edit Dvd- ");

    $.ajax({
        type: 'GET',
        url: 'https://tsg-dvds.herokuapp.com/dvd/' + dvdId,
        success: function(data, status) {
            $('#editTitlePage').text("Edit Dvd: " + data.title);
            $('#editTitle').val(data.title);
            $('#editReleaseYear').val(data.releaseYear);
            $('#editDirector').val(data.director);
            $('#editRating').val(data.rating);
            $('#editNotes').val(data.notes);
            $('#editDvdId').val(data.id);

        },
        error: function() {
            $('#errorMessages')
            .append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later.'));
        }
    })

    $('#dvdTableContainerDiv').hide();
    $('#editFormDiv').show();
    $('#addFormDiv').hide();
}

function showDvdDetail(dvdId) {
    clearErrorMessage();
    $('#dvdDetailPage').text("Dvd Title ");

    $.ajax({
        type: 'GET',
        url: 'https://tsg-dvds.herokuapp.com/dvd/' + dvdId,
        success: function(data, status) {
            $('#dvdDetailPage').text(data.title);
            $('#detailTitle').text(data.title);
            $('#detailReleaseYear').text(data.releaseYear);
            $('#detailDirector').text(data.director);
            $('#detailRating').text(data.rating);
            $('#detailNotes').text(data.notes);
            $('#detailDvdId').val(data.id);

        },
        error: function() {
            $('#errorMessages')
            .append($('<li>')
            .attr({class: 'list-group-item list-group-item-danger'})
            .text('Error calling web service. Please try again later.'));
        }
    })

    $('#dvdTableContainerDiv').hide();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();
    $('#dvdDetail').show();
}

function updateDvds(dvdId) {
    $('#updateButton').click(function(event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));

        if(haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'PUT',
            url: 'https://tsg-dvds.herokuapp.com/dvd/' +  $('#editDvdId').val(),
            data: JSON.stringify({
                dvdId:  $('#editDvdId').val(),
                title: $('#editTitle').val(),
                releaseYear: $('#editReleaseYear').val(),
                director: $('#editDirector').val(),
                rating: $('#editRating').val(),
                notes: $('#editNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            'success': function() {
                clearErrorMessage();
                hideEditForm();
                loadDvds();
            },
            'error': function(request, status, error) {
                $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
                /*
                $('#errorMessagesEdit')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
                */
                hideEditForm(); //delete when figured out the bug
                loadDvds();//delete when figured out the bug
                //alert(request.responseText);
            }
        })
    })
}

function deleteDvd(dvdId) {
    $.ajax({
        type: 'DELETE',
        url: 'https://tsg-dvds.herokuapp.com/dvd/' + dvdId,
        success: function() {
            loadDvds();
        }
    });
}

function checkAndDisplayValidationErrors(input) {
    clearErrorMessage();

    var errorMessages = [];

    input.each(function() {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
            $('#errorMessagesAdd').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
            $('#errorMessagesEdit').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}