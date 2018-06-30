$(document).ready(() => {
  //Delete buttons
  $('body').on('click', '.delete-menu',function(){
    var item = $(this).data('item');
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this menu item!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {        
        $('#menuDeleteForm').find('[name="id"]').val(item);
        $('#menuDeleteForm').submit();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  })
});
  