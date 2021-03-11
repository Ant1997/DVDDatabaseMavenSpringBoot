$(document).ready(function () {
    loadDvds();
    showAddForm();
    addDvds();
    updateDvds();
});

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
                    row += '<td>' + title + '</td>';
                    row += '<td>' + release_date + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-info" onclick="showEditForm(' + dvdId + ')">Edit</button></td>';
                    row += '<td><button type="button" class="btn btn-danger" onclick="deleteDvd(' + dvdId + ')">Delete</button></td>';
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
               $('#errorMessages').empty();
                 $('#addTitle').val(''),
                 $('#addReleaseYear').val(''),
                 $('#addDirector').val(''),
                 $('#addRating').val(''),
                 $('#addNotes').val('')
               loadDvds();
               hideAddForm();
           },
           error: function () {
               $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
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
    $('#errorMessages').empty();

    //$('#editTitle').val('');
   // $('#editReleaseYear').val('');
    //$('#editDirector').val('');
    //$('#editRating').val('');
    //$('#editNotes').val('');

    $('#dvdTableContainerDiv').show();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();
}

function clearDvdsTable() {
    $('#contentRows').empty();
}


function hideEditForm() {
    $('#errorMessages').empty();

    $('#editTitle').val('');
    $('#editReleaseYear').val('');
    $('#editDirector').val('');
    $('#editRating').val('');
    $('#editNotes').val('');

    $('#dvdTableContainerDiv').show();
    $('#editFormDiv').hide();
    $('#addFormDiv').hide();

}

function showEditForm(dvdId) {
    $('#errorMessages').empty();
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

function updateDvds(id) {
    $('#updateButton').click(function(event) {

        var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));

        if(haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'PUT',
            url: 'https://tsg-dvds.herokuapp.com/dvd/' +  $('#editDvdId').val(),
            data: JSON.stringify({
                id:  $('#editDvdId').val(),
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
                $('#errorMessage').empty();
                hideEditForm();
                loadDvds();
            },
            'error': function() {
                hideEditForm();
                loadDvds();
                $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
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
    $('#errorMessages').empty();

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
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}