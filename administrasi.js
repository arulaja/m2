
	function TambahFolder(id){
		var htmlInput = '<input type="text" id="nama" class="swal2-input" placeholder="Nama Folder">';
		htmlInput += '<select name="select" class="form-control" id="akses">'
							+ '<option value="1">Umum</option>'
							+ '<option value="0">Private</option>'
						+'</select>'
	    swal({
	      title: 'Buat Direktori',
	      html: htmlInput,
	      confirmButtonText: 'Confirm',
	      showCancelButton: true,
	      preConfirm: function() {
	        return new Promise((resolve, reject) => {
	          var objPost = {};
	          objPost = PostUserInfo(objPost);
	          objPost['kirim'] = 'tambah_dokumen_admin' ;
	          objPost['type'] = 'folder' ;
	          objPost['id'] = id ;
	          objPost['nama'] = getValueElm("nama")
	          objPost['akses'] = getSelectValueElm('akses') ;
	          
	          Swal.fire({
	            title: 'Tambah Direktori ?',
	            type: 'warning',
	            showCancelButton: true,
	          }).then((result) => {
	            if (result.value) {

	              LoadingProgress(true);
	              axios.post(urlDB, objPost )
	              .then(function (res) {
	                var resData = res.data ;
	                StoreBase64Npwp = new Array();
	                SwalPopupSuccess('Berhasil disimpan')   ;
	                LoadingProgress(false)
	                ListDokumenAdmin(id);
	              })
	              .catch(function (err) {
	                Swal.fire({type: 'error',title: 'Gagal Proses'})
	              });

	              
	            }
	          })
	          //resolve();
	        });
	      }
	    }).then((data) => {
	      //console.log(data);
	    });

	}

	function TambahFileDokumen(id){
	    var htmlInput = '<input type="text" id="nama" name="nama" class="swal2-input my-1" placeholder="Nama Dokumen">';
	    htmlInput += '<input type="text" id="nomor" name="nomor" class="swal2-input my-1" placeholder="Nomor Dokumen">';
	    htmlInput += '<textarea type="text" id="keterangan" name="keterangan" class="swal2-input p-2 my-1" placeholder="Keterangan"></textarea>' ;
	    htmlInput += '<select name="select" class="swal2-input my-1" id="akses">'
							+ '<option value="1">Umum</option>'
							+ '<option value="0">Private</option>'
						+'</select>'
	    htmlInput += '<input type="file" id="foto" onchange="handleUpload(this.files)" >';
	    swal({
	      title: 'Upload Dokumen',
	      html: htmlInput,
	      confirmButtonText: 'Confirm',
	      showCancelButton: true,
	      
	      preConfirm: function() {
	        return new Promise((resolve, reject) => {
	          var objPost = {};
	          objPost = PostUserInfo(objPost);
	          objPost['kirim'] = 'tambah_dokumen_admin' ;
	          objPost['type'] = 'file' ;
	          objPost['id'] = id ;
	          objPost['nama'] = getValueElm("nama")
	          objPost['nomor'] = getValueElm("nomor")
	          objPost['keterangan'] = getValueElm("keterangan")
	          objPost['akses'] = getSelectValueElm('akses') ;

	          objPost['file'] = fileListUpload ;

	          Swal.fire({
	            title: 'Simpan ?',
	            type: 'warning',
	            showCancelButton: true,
	          }).then((result) => {
	            if (result.value) {
	              LoadingProgress(true);
	              axios.post(urlDB, objPost )
	              .then(function (res) {
	                var resData = res.data ;
	                if (resData=='1' || resData=='ok'){
	                  LoadingProgress(false);
	                  ListDokumenAdmin(id);

	                  fileListDO = new Array();
	                  SwalPopupSuccess('Berhasil disimpan ')   ;
	                } else {
	                  LoadingProgress(false);
	                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
	                }

	              })
	              .catch(function (err) {
	                LoadingProgress(false);
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

	function HapusDokumen(id){
		Swal.queue([{
	      title: 'Hapus ??',
	      confirmButtonText: 'Ya',
	      cancelButtonText: 'Batal',
	      type: 'question',
	      showCancelButton: true,
	      showLoaderOnConfirm: true,
	      preConfirm: () => {
	        var obj = {};
	        obj = PostUserInfo(obj);
	        obj['kirim'] = 'hapus_dokumen_admin' ;
	        obj['id'] = id ;
	       
	        $.post(urlDB,obj,
	          function(data,status){
	            if (status=="success"){
	              if (data=='1' || data=='ok'){
	                SwalPopupSuccess('Berhasil disimpan')   ;
	                gotoJS('administrasi','dokumen')
	              } else {
	                Swal.fire({type: 'error',title: data})
	              }
	            } else {
	              Swal.fire({type: 'error',title: 'Gagal Proses'})
	            };
	          } 
	        ); 
	      },
	      allowOutsideClick: () => !Swal.isLoading()
	    }])
	}

	function ListDokumenAdmin(id){
		xmlHttp=GetXmlHttpObject();
	    if (xmlHttp) {
	      TambahDataGaransi('batal',0)
	      var url = 'aplikasi/administrasi/dokumen.php' ;
	      var uid = getUserInfo('id');
  		  var akses = getUserInfo('id_akses');
	      var param = 'id='+id+'&uid='+uid+'&akses='+akses;;
	      LoadingProgress(true);
	      var obj = document.getElementById('main-content');
	      xmlHttp.open("POST", url , true);
	      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	      xmlHttp.onreadystatechange = function() {
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	          if (obj!='undefined' && obj!=null){
	            obj.innerHTML = xmlHttp.responseText;
	            LoadingProgress(false);
	          }          
	          ReloadJsFunc()
	        };
	      };
	      xmlHttp.send(param);
	    }
	}

	function ViewFileAdmin(id){
	    var obj = {};
	    obj = PostUserInfo(obj);
	    obj['kirim'] = 'view_file_administrasi' ;
	    obj['id'] = id ;
	    $.post(urlDB,obj,
	      function(data,status){
	        if (status=="success"){
	          LoadingProgress(false);
	          var json = JSON.parse(data);
	          var filePath = json['list']['path_dokumen'];
	          var url = urlHome+'file_upload/'+filePath
	          var infoModal = document.getElementById('ContentPopupModal');
	          infoModal.innerHTML = '<iframe src="'+url+'" width="100%" height="600px"></iframe>';
	          $("#PopupModal").modal()

	        } else {
	          LoadingProgress(false);
	          Swal.fire({type: 'error',title: 'Gagal Proses'})
	        };
	      } 
	    ); 
	  }

	function CariDokumenAdmin(){
	    var htmlInput = '<input type="text" id="cari" name="cari" class="swal2-input my-1" placeholder="Cari Dokumen">';
	    swal({
	      title: 'Cari Dokumen',
	      html: htmlInput,
	      confirmButtonText: 'Cari',
	      showCancelButton: true,

	      
	      preConfirm: function() {
	        return new Promise((resolve, reject) => {
	        	resolve();

	          	xmlHttp=GetXmlHttpObject();
			    if (xmlHttp) {
			      var url = 'aplikasi/administrasi/dokumen.php' ;

			      var uid = getUserInfo('id');
  					var akses = getUserInfo('id_akses');
			      var param = 'cari='+getValueElm("cari")+'&uid='+uid+'&akses='+akses;

			      var obj = document.getElementById('main-content');
			      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
			      xmlHttp.open("POST", url , true);
			      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			      xmlHttp.onreadystatechange = function() {
			        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			          if (obj!='undefined' && obj!=null){
			            obj.innerHTML = xmlHttp.responseText;
			          }          
			          ReloadJsFunc()
			        };
			      };
			      xmlHttp.send(param);
			    }
	        });
	      }
	    }).then((data) => {
	      console.log(data);
	    });

	  }


	function CariNomorDokumen(){
	    xmlHttp=GetXmlHttpObject();
	    if (xmlHttp) {
	      TambahDataBrgCustome('batal',0)

	      var url = 'aplikasi/administrasi/nomor_view.php' ;
	      var uid = getUserInfo('id');
	      var akses = getUserInfo('id_akses');

	      var cari = getValueElm('cari') ;
	      var param = 'cari='+cari+'&uid='+uid+'&akses='+akses;

	      var obj = document.getElementById('view_list_barang');
	      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

	      xmlHttp.open("POST", url , true);
	      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	      xmlHttp.onreadystatechange = function() {
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	          if (obj!='undefined' && obj!=null){
	            obj.innerHTML = xmlHttp.responseText;

	          }          
	          ReloadJsFunc()
	        };
	      };

	      xmlHttp.send(param);
	    }
	}

	function TambahNomorDokumen(tag,id){

    if (tag=='batal'){
      	addValueElm('id_bidang',null);
      	addValueElm('bidang',null);
      	addValueElm('keterangan',null);

      	$("#view_list").removeClass("col-md-8");
      	$("#view_list").addClass('col-md-12')
      	$("#view_edit").addClass('hidden')


      	$("#input_cari").removeClass('col')
      	$("#input_cari").addClass('col-md-10')

      	$("#btn_cari").removeClass('col-auto')
      	$("#btn_cari").addClass('col')

      	$("#box_btn_cari").removeClass('px-2')
      	$("#box_btn_cari").addClass('px-0')


    } else if (tag=='tambah'){
    	addValueElm('id_bidang',null);
      	addValueElm('bidang',null);
      	addValueElm('keterangan',null);

      	$("#view_list").removeClass("col-md-12");
      	$("#view_list").addClass('col-md-8')
      	$("#view_edit").removeClass('hidden')


      	$("#input_cari").removeClass('col-md-10')
      	$("#input_cari").addClass('col')

      	$("#btn_cari").removeClass('col')
      	$("#btn_cari").addClass('col-auto')

      	$("#box_btn_cari").removeClass('px-0')
      	$("#box_btn_cari").addClass('px-2')

    } else if (tag=='simpan'){
      	var keterangan = getValueElm('keterangan') ;
      	var bidang = getSelectValueElm('bidang') ;
      	var id_bidang = getValueElm('id_bidang') ;
      	var jml_nomor = getValueElm('jml_nomor') ;
      	if (keterangan=='' || parseInt(bidang)<=0){
        	Swal.fire({type: 'error',title: 'Silahkan isi Dengan benar'})
        	return ;
      	}
      	Swal.queue([{
        	title: 'Simpan ??',
        	confirmButtonText: 'Ya',
        	cancelButtonText: 'Batal',
        	type: 'question',
        	showCancelButton: true,
        	showLoaderOnConfirm: true,
        	preConfirm: () => {
        		LoadingProgress(true);
          		var obj = {};
          		obj = PostUserInfo(obj);
          		obj['id'] = getValueElm('id_bidang') ;
          		obj['kirim'] = 'simpan_nomor_administrasi' ;
          		obj['bidang'] = bidang ;
          		obj['keterangan'] = keterangan ;
          		obj['jml_nomor'] = jml_nomor ;
		          
          		$.post(urlDB,obj,
          			function(data,status){
          				if (status=="success"){
          					LoadingProgress(false);
          					TambahNomorDokumen('batal',0)
          					CariNomorDokumen()
          					if (data=='0' || data==0 || data===false){
          						Swal.fire({type: 'error',title: 'Gagal Proses'})
          					} else {
	                			Swal.fire({type: 'success',title: data})	
          					}
          					

              			} else {
                			LoadingProgress(false);
                			Swal.fire({type: 'error',title: 'Gagal Proses'})
              			};
            		} 
          		); 
        	}
      	}])
    }
  }

