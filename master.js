
  function CariBarang(tag,nPage){

    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }

    var uid = getUserInfo('id');
    var akses = getUserInfo('id_akses');

    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['cari'] = getValueElm('cari') ;
    p_obj['info'] = tag ;
    p_obj['page'] = page ;
    p_obj['uid'] = uid ;
    p_obj['akses'] = akses ;

    runXHR('aplikasi/master/barang_view.php',p_obj,CariBarangCallback);
  }

  function CariBarangCallback(data){
    var obj = document.getElementById('view_list');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML = data;
      ReloadJsFunc();
    } else {
      PopupModalHtml(data);
    }

  }

  /* batas */
  function TambahDataBrg(tag,id){

    if (tag=='batal'){
      addValueElm('id_barang',null);
      //$("#view_list").removeClass("col-md-8");
      //$("#view_list").addClass('col-md-12')
      $("#view_edit").addClass('hidden')

    } else if (tag=='tambah'){
      addValueElm('id_barang',null);
      //$("#view_list").removeClass("col-md-12");
      //$("#view_list").addClass('col-md-8')
      $("#view_edit").removeClass('hidden')
      addValueElm('barcode',null);
      addValueElm('nama',null);
      addValueElm('desc',null);
      addValueElm('spec',null);
      addValueElm('merk',null);
      addValueElm('part_no',null);
      addValueElm('kondisi',null);
      addValueElm('qty',0);
      addValueElm('beli',0);
      addValueElm('jual',0);
      addValueElm('satuan',null);
      addValueElm('kategori',null);
      addValueElm('suplier',null);
      addValueElm('siplah',0);
      addValueElm('ekatalog',0);
      addValueElm('modal',0);
      addValueElm('project',0);
      addValueElm('distributor',0);

      document.getElementById('brg_retail').checked = true ;
      document.getElementById('brg_project').checked = false ;

    } else if (tag=='simpan_harga'){
      Swal.queue([{
        title: 'Harga di Rubah ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['id'] = getValueElm('id_barang') ;
          obj['kirim'] = 'update_harga_barang' ;
          obj['modal'] = getValueElm('modal') ;
          obj['beli'] = getValueElm('beli') ;
          obj['jual'] = getValueElm('jual') ;
          obj['distributor'] = getValueElm('distributor') ;
          obj['project'] = getValueElm('project') ;
          obj['siplah'] = getValueElm('siplah') ;
          obj['ekatalog'] = getValueElm('ekatalog') ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  //$("#view_list").removeClass("col-md-8");
                  //$("#view_list").addClass('col-md-12')
                  $("#view_edit").addClass('hidden')
                } else {
                  Swal.fire({type: 'error',title: data})
                }

              } else {
                LoadingProgress(false);
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          ); 
        }
      }])
    } else if (tag=='simpan'){
      var stsProject = 0  ;
      var stsRetail = 0  ;
      if (getValueCheckboxElm('brg_retail')) stsRetail = 1 ; 
      if (getValueCheckboxElm('brg_project')) stsProject = 1 ; 
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = getValueElm('id_barang') ;
      obj['kirim'] = 'simpan_data_barang' ;
      obj['barcode'] = getValueElm('barcode') ;
      obj['nama'] = getValueElm('nama') ;
      obj['desc'] = getValueElm('desc') ;
      obj['spec'] = getValueElm('spec') ;
      obj['merk'] = getValueElm('merk') ;
      obj['part_no'] = getValueElm('part_no') ;
      obj['kondisi'] = getValueElm('kondisi') ;
      obj['qty'] = getValueElm('qty') ;
      obj['modal'] = getValueElm('modal') ;
      obj['beli'] = getValueElm('beli') ;
      obj['jual'] = getValueElm('jual') ;
      obj['distributor'] = getValueElm('distributor') ;
      obj['project'] = getValueElm('project') ;
      obj['satuan'] = getValueElm('satuan') ;
      obj['kategori'] = getSelectValueElm('kategori') ;
      obj['suplier'] = getSelectValueElm('suplier') ;
      obj['siplah'] = getValueElm('siplah') ;
      obj['ekatalog'] = getValueElm('ekatalog') ;
      obj['brg_retail'] = stsRetail ;
      obj['brg_project'] = stsProject ;
      obj['img_produk'] = fileListProduk ;

      SubmitData('Simpan ??',JSON.stringify(obj),SimpanBrgCallBack);


    } else if (tag=='hapus'){
      addValueElm('id_barang',null);

      Swal.queue([{
        title: 'Hapus ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['id'] = id ;
          obj['kirim'] = 'hapus_data_barang' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  CariBarang();
                } else {
                  Swal.fire({type: 'error',title: data})
                }
              } else {
                LoadingProgress(false);
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          ); 
        
          
        }
      }])
    } else if (tag=='edit'){
      LoadingProgress(true);
      //console.log("id == "+id)
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'detail_barang' ;

      $.post(urlDB,obj,
        function(data,status){
          LoadingProgress(false);
          if (status=="success"){
            //$("#view_list").removeClass("col-md-12");
            //$("#view_list").addClass('col-md-8')
            //getValueCheckboxElm
            $("#view_edit").removeClass('hidden')
            //console.log(data)
            var dataAry = JSON.parse(data);

            var detailAry = dataAry['detail'][0]
            var brgProject = 0 ;
            var brgRetail = 0 ; 
           

            var cElmRetail = document.getElementById('brg_retail');
            var cElmProject = document.getElementById('brg_project');

            if (detailAry['brg_retail']==1) cElmRetail.checked = true ;
            else cElmRetail.checked = false ;

            if (detailAry['brg_project']==1) cElmProject.checked = true ;
            else cElmProject.checked = false ;

            var cElmImage = document.getElementById('imgShow');
            if (cElmImage!='undefined' && cElmImage!=null){
              var pathImg = detailAry['path_image'] ;
              if (pathImg=='undefined' || pathImg==null || pathImg==''){
                cElmImage.src = "file_upload/PRODUK/img-produk.png";
              } else {
                cElmImage.src = urlHome+"file_upload/"+pathImg ;
              }
            }
            

            addValueElm('id_barang',detailAry['id']);

            addValueElm('barcode',detailAry['id_barcode']);
            addValueElm('nama',detailAry['nama']);
            addValueElm('desc',detailAry['deskripsi']);
            addValueElm('spec',detailAry['spesifikasi']);
            addValueElm('merk',detailAry['merk']);
            addValueElm('part_no',detailAry['part_no']);
            addValueElm('kondisi',detailAry['kondisi']);
            addValueElm('qty',detailAry['stock']);
            addValueElm('satuan',detailAry['satuan']);
            addValueElm('kategori',detailAry['id_kategori']);
            addValueElm('suplier',detailAry['id_suplier']);
            addValueElm('jual',detailAry['bebas']);
            addValueElm('project',detailAry['project']);
            addValueElm('distributor',detailAry['distributor']);
            var info_akses = getUserInfo('id_akses');
            if (info_akses==15 || info_akses==99 || info_akses==100 || info_akses==1000){
              addValueElm('modal',detailAry['modal']);
              addValueElm('beli',detailAry['beli']);
              addValueElm('siplah',detailAry['siplah']);
              addValueElm('ekatalog',detailAry['ekatalog']);
            }
            
            setElmFocus('barcode');
            document.getElementById("view_edit").scrollIntoView();
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'})
          };
        } 
      ); 

      
    }

  }

  function SimpanBrgCallBack(data){
    if (data=='1' || data=='ok'){
      $("#view_edit").addClass('hidden');
      SubmitDataStatus('success','Berhasil disimpan');
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }

  function ReportBarang(tag){
    var cari= getValueElm('cari') ;
    if (cari=='undefined' || cari==null || cari==''){
      cari = '';
    }
    var params = {} ;
    params.cari = cari ;
    params.uid = getUserInfo('id');
    params.akses =  getUserInfo('id_akses');

    if (tag=='excel'){
      OpenWindowWithPost('aplikasi/master/barang_excel.php', "", "karyawan", params);  
    } else {
      OpenWindowWithPost('aplikasi/master/barang_pdf.php', "", "karyawan", params);  
    }
  }


  function FormUpdateStock(tag,id){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      'Quantity','Keterangan'
    ]).then((result) => {
      if (result.value) {
        var qty = result.value[0] ;
        var ket = result.value[1] ;
        if (qty!=''){
          UpdateStockMaster(tag,id,qty,ket) ;  
        }
        
      }
    })
  }

  function UpdateStockMaster(tag,id,qty,ket){
     Swal.queue([{
        title: 'Update Stock Barang ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['id'] = id ;
          obj['qty'] = qty ;
          obj['ket'] = ket ;
          obj['kirim'] = 'update_stock_data_barang' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  CariBarang(tag);
                } else {
                  Swal.fire({type: 'error',title: data})
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


  function CariBarangCustome(){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      TambahDataBrgCustome('batal',0)

      var url = 'aplikasi/master/custome/custome_view.php' ;
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
  function TambahDataBrgCustome(tag,id){

    if (tag=='batal'){
      addValueElm('id_custome',null);
      addValueElm('nama',null);
      addValueElm('desc',null);
      addValueElm('harga',null);

      $("#view_list").removeClass("col-md-7");
      $("#view_list").addClass('col-md-12')
      $("#view_edit").addClass('hidden')
      $("#list_tbl_custome tr").remove(); 


      $("#input_cari").removeClass('col')
      $("#input_cari").addClass('col-md-10')

      $("#btn_cari").removeClass('col-auto')
      $("#btn_cari").addClass('col')

      $("#box_btn_cari").removeClass('px-2')
      $("#box_btn_cari").addClass('px-0')


    } else if (tag=='tambah'){
      addValueElm('id_custome',null);
      addValueElm('nama',null);
      addValueElm('desc',null);
      addValueElm('harga',null);

      $("#view_list").removeClass("col-md-12");
      $("#view_list").addClass('col-md-7')
      $("#view_edit").removeClass('hidden')
      $("#list_tbl_custome tr").remove(); 


      $("#input_cari").removeClass('col-md-10')
      $("#input_cari").addClass('col')

      $("#btn_cari").removeClass('col')
      $("#btn_cari").addClass('col-auto')

      $("#box_btn_cari").removeClass('px-0')
      $("#box_btn_cari").addClass('px-2')


      

    } else if (tag=='simpan'){
      var nama = getValueElm('nama') ;
      var desc = getValueElm('desc') ;
      var harga = getValueElm('harga') ;
      var DataList = getListBarangCustome();
      if (nama==''){
        Swal.fire({type: 'error',title: 'Nama Tidak Boleh Kosong'})
        return ;
      }
      if (DataList.length<=0){
        Swal.fire({type: 'error',title: 'Silahkan masukan List Barang'})
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
          obj['id'] = getValueElm('id_custome') ;
          obj['kirim'] = 'simpan_data_barang_custome' ;
          obj['nama'] = nama ;
          obj['desc'] = desc ;
          obj['harga'] = harga ;
          obj['list'] = DataList ;
          
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  CariBarangCustome();
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  $("#view_list").removeClass("col-md-8");
                  $("#view_list").addClass('col-md-12')
                  $("#view_edit").addClass('hidden')
                } else {
                  Swal.fire({type: 'error',title: data})
                }

              } else {
                LoadingProgress(false);
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          ); 
        }
      }])
    } else if (tag=='hapus'){
      addValueElm('id_custome',null);

      Swal.queue([{
        title: 'Hapus ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['id'] = id ;
          obj['kirim'] = 'hapus_data_barang_custome' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  CariBarangCustome();
                } else {
                  Swal.fire({type: 'error',title: data})
                }
              } else {
                LoadingProgress(false);
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          ); 
        
          
        }
      }])
    } else if (tag=='edit'){
      LoadingProgress(true);
      $("#list_tbl_custome tr").remove(); 

      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'detail_barang_custome' ;

      $.post(urlDB,obj,
        function(data,status){
          LoadingProgress(false);
          if (status=="success"){
            $("#view_list").removeClass("col-md-12");
            $("#view_list").addClass('col-md-7')
            $("#view_edit").removeClass('hidden')

            $("#input_cari").removeClass('col-md-10')
            $("#input_cari").addClass('col')

            $("#btn_cari").removeClass('col')
            $("#btn_cari").addClass('col-auto')

            $("#box_btn_cari").removeClass('px-0')
            $("#box_btn_cari").addClass('px-2')

            var dataAry = JSON.parse(data);

            var detailAry = dataAry['detail'][0]

            addValueElm('id_custome',detailAry['id']);
            addValueElm('nama',detailAry['nama']);
            addValueElm('harga',detailAry['harga']);
            addValueElm('desc',detailAry['deskripsi']);

            var brgRinci = detailAry['list']
            var rowLength = brgRinci.length ;

            for (var i=0 ; i<rowLength ; i+=1){
              var id = brgRinci[i]['id_barang'] ;
              var nama = brgRinci[i]['nama'] ;
              var qty = brgRinci[i]['quantity'] ;
              var BrgIn = brgRinci[i]['barang_masuk'] ;
              var stsIn = 'in' ;
              if (BrgIn==0) stsIn = 'out';
              
              var btn = '<a href="#" onclick="Javascript: HapusListBarangCustome('+id+'); return false ;" class="label label-danger" data-toggle="tooltip" data-placement="top" title="" data-original-title=" Hapus "><i class="ti-close"></i></a>';
              var sHtml = '<td class="hidden">'+id+'</td>';
              sHtml += '<td class="overlapNewLine">'+nama+'</td>';
              sHtml += '<td style="width:30px;">'+stsIn+'</td>';
              sHtml += '<td style="width:30px;">'+btn+'</td>';
              var warna_bg = "bg-success";
              if (stsIn=="in") {
                warna_bg = "bg-warning";
              }
              $('#list_tbl_custome').append('<tr class="'+warna_bg+'" id="tbl_'+id+'"">'+sHtml+'</tr>');
            }
            
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'});
          };
        } 
      ); 

      
    }

  }
  function HapusListBarangCustome(id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        $('#tbl_'+id).remove();
        setElmFocus('cari_id_custome');
      }
    }])

  }

  function getListBarangCustome(){
    var table = document.getElementById("list_tbl_custome") ;
    var rowLength = table.rows.length ;
    //if (rowLength>0){
      var objList = [];
      for (var i=0 ; i<rowLength ; i+=1){
        var row = table.rows[i] ;
        var id = table.rows[i].cells[0].innerHTML ;
        var nama = table.rows[i].cells[1].innerHTML ;
        var inout = table.rows[i].cells[2].innerHTML ;
        var objElm = {};
        objElm['id'] = id ;
        objElm['qty'] = 1 ;
        if (inout=='in') objElm['in'] = 1 ;
        else objElm['in'] = 0 ;  
        
        objList.push(objElm);

      }
      return objList ;
    //}
    
    
  }

  var fileListProduk = new Array();
  function handleFilesProdukUpload(files) {
    fileListProduk = new Array();
    files = [...files]
    files.forEach(previewFileProduk)

    //document.getElementById('imgShow').src = window.URL.createObjectURL(files[0])
  }

  function previewFileProduk(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var objImg = {};
      objImg['name'] = nmFile ;
      objImg['base64'] = reader.result ;
      fileListProduk.push(objImg)
      document.getElementById('imgShow').src = reader.result ;
    }
  }


  function getBase64ImageProduk(img) {
   
    var c = document.createElement("canvas");
    c.height = img.naturalHeight;
    c.width = img.naturalWidth;
    var ctx = c.getContext("2d");

    ctx.drawImage(img, 0, 0, c.width, c.height);
    var base64String = c.toDataURL();
    return base64String ;

  }
