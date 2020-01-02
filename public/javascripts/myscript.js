
function deleteUnit(id) {
    $.ajax({

        url: '/unit/delete-json/' + id,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ id }),
        type: 'POST',
        success: ((res) => {
            console.log("Result", res)
            $("#" + id).remove();
        }),
        error: ((error) => {
            console.log('-------------------AJAX----------------------')
            console.log("Error", error)
            alert("Item can not be deleted!")
        })
    });

}

function deleteParkade(id) {
    $.ajax({
        url: '/parkade/delete-json/' + id,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({ id }),
        type: 'POST',
        success: ((res) => {
            console.log('-------------------AJAX----------------------')
            console.log("Result", res)
            $("#" + id).remove();
        }),
        error: ((error) => {
            console.log('-------------------AJAX----------------------')
            console.log("Error", error)
            alert("Item can not be deleted!")
        })
    });

}

