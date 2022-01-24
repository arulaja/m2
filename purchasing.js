
  function ProsesPermintaan(id){
    fileListDO = new Array();
    var htmlInput = '<input type="text" id="suplier" class="swal2-input" placeholder="Suplier">';
    htmlInput += '<input type="text" id="no_order" class="swal2-input" placeholder="Nomor Order">';
    htmlInput += '<input type="text" id="keterangan" class="swal2-input" placeholder="Keterangan">';
    swal({
      title: 'Proses Permintaan Barang',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'proses_puch_permintaan' ;
          objPost['id'] = id
          objPost['suplier'] = getValueElm("suplier")
          objPost['no_order'] = getValueElm("no_order")
          objPost['keterangan'] = getValueElm("keterangan")

          Swal.fire({
            title: 'Yakin Sudah di Proses ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  LoadingProgress(false)
                  gotoJS('purchasing','permintaan');

                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }

  function TolakPermintaan(id){
    fileListDO = new Array();
    var htmlInput = '<input type="text" id="keterangan" class="swal2-input" placeholder="Keterangan">';
    swal({
      title: 'Permintaan di Tolak ?',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'tolak_puch_permintaan' ;
          objPost['id'] = id
          objPost['keterangan'] = getValueElm("keterangan")

          Swal.fire({
            title: 'Yakin di Tolak ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  LoadingProgress(false)
                  gotoJS('purchasing','permintaan');
                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });

  }
