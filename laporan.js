
  function LaporanTrx(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      document.getElementById("view_list_detail").innerHTML="";

      var url = 'aplikasi/laporan/trx_view.php' ;
     
      var tanggal = getValueElm('tanggal') ;
      var no = getValueElm('no_trx') ;
      var id_pelanggan = getValueElm('id_pelanggan') ;
      var id_suplier = getValueElm('id_suplier') ;
      var keterangan = getValueElm('keterangan') ;
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');

      var pelanggan = getValueElm('pelanggan') ;
      if (pelanggan=='') {
        id_pelanggan = 0 ;
      }
      var suplier = getValueElm('suplier') ;
      if (suplier=='') {
        id_suplier = 0 ;
      }

      var sts_bayar = getSelectValueElm('sts_bayar') ;
      var sts_lunas = getSelectValueElm('sts_lunas') ;


      var param = 'trx='+tag+'&no='+no+'&tanggal='+tanggal+'&pelanggan='+id_pelanggan+'&suplier='+id_suplier+'&keterangan='+keterangan+'&sts_bayar='+sts_bayar+'&sts_lunas='+sts_lunas
      +'&uid='+uid+'&akses='+akses;


      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list").scrollIntoView();

          }          
          ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  function LaporanTrxKeep(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      document.getElementById("view_list_detail").innerHTML="";

      var url = 'aplikasi/laporan/trx_view.php' ;
     
      var no = getValueElm('no_trx') ;
      var id_pelanggan = getValueElm('id_pelanggan') ;
      var keterangan = getValueElm('keterangan') ;
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');
      var sts_selesai = getSelectValueElm('sts_selesai') ;
      var id_suplier = getValueElm('id_suplier') ;

      var pelanggan = getValueElm('pelanggan') ;
      if (pelanggan=='') id_pelanggan = 0 ;

      var suplier = getValueElm('suplier') ;
      if (suplier=='') id_suplier = 0 ;

      var param = 'trx='+tag+'&no='+no+'&pelanggan='+id_pelanggan+'&suplier='+id_suplier+'&keterangan='+keterangan+'&sts_selesai='+sts_selesai
      +'&uid='+uid+'&akses='+akses;
      console.log("param = "+param)

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list").scrollIntoView();

          }          
          ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  function ExcelTrx(tag){
    var pelanggan = getValueElm('pelanggan') ;
    if (pelanggan=='') {
      id_pelanggan = 0 ;
    }
    var suplier = getValueElm('suplier') ;
    if (suplier=='') {
      id_suplier = 0 ;
    }

    var params = {} ;
    params.trx = tag ;
    params.no = getValueElm('no_trx') ;
    params.tanggal = getValueElm('tanggal') ;
    params.suplier = getValueElm('suplier') ;
    params.pelanggan = getValueElm('pelanggan') ;
    params.keterangan = getValueElm('keterangan') ;
    params.id_pelanggan = getValueElm('id_pelanggan') ;
    params.id_suplier = getValueElm('id_suplier') ;
    
    
    


    OpenWindowWithPost('aplikasi/laporan/trx_excel.php', "", "karyawan", params);
  }


  function DetailTrx(tag,id){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/laporan/info_trx.php' ;
      var uid = getUserInfo('id');
      var akses = getUserInfo('id_akses');
      var param = 'trx='+tag+'&id='+id+'&uid='+uid+'&akses='+akses ;

      document.getElementById("view_list_detail").scrollIntoView();
      
      var obj = document.getElementById('view_list_detail');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            document.getElementById("view_list_detail").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  
  function KeepKirimKeExpedisi(id){
    Swal.queue([{
      title: 'Kirim ke Expedisi  ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'keep_ke_expedisi' ;
        obj['id'] = id ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                gotoJS('lap','g2keep');  
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }

  function KeepKirimKeExternalBrg(id,notrx,idbrg,nama){
      var buttonsPlus = $('<div>')
      .append(createButton('Toko','sw_toko','btn-primary'))
      .append(createButton('External','sw_ext','btn-success'))
      .append(createButton('Batal','sw_batal',''));
      swal({
        html: buttonsPlus,
        title: "Kirim Barang Ke ??",
        type: 'question',
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_toko').on('click',function () {
            KeepKirimKeExternalBrgAct('toko',id,notrx,idbrg,nama)
          });
          $('#sw_ext').on('click',function () {
            KeepKirimKeExternalBrgAct('keluar',id,notrx,idbrg,nama)
          });
          
          
        }
      });

  }
  function KeepKirimKeExternalBrgAct(kirimKe,id,notrx,idbrg,nama){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      { 
        title: "Quantity",
        text: "[ ke "+kirimKe+" ] "+nama
      },
      { 
        title: "Keterangan",
        text: "[ ke "+kirimKe+" ] "+nama
      }
  
    ]).then((result) => {
      if (result.value) {
        var qty = result.value[0] ;
        var ket = result.value[1] ;
        if (qty!=''){
          ProsesKeepKirimKeExternalBrg(kirimKe,id,notrx,idbrg,qty,ket,nama) ;  
        }
        
      }
    })
  }
  function ProsesKeepKirimKeExternalBrg(kirimKe,id,notrx,idbrg,qty,ket,nama){
    var infoDesc = nama + "<br/>" + "Quantity = "+qty + "<br/>" + ket ;
    Swal.queue([{
      title: 'Barang Keep akan di Kirim   ??',
      html: infoDesc,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'keep_ke_external_brg' ;
        obj['notrx'] = notrx ;
        obj['id_barang'] = idbrg ;
        obj['qty'] = qty ;
        obj['ke'] = kirimKe ;
        obj['keterangan'] = ket ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                //LaporanTrx('g2keep');  
                DetailTrx('g2keep',id);  

              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }

  function KeepKirimKeExternal(id){
    Swal.queue([{
      title: 'Barang Keep akan di Kirim   ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'keep_ke_external' ;
        obj['id'] = id ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                gotoJS('lap','g2keep');  
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }

  function KeepkeGudangBrg(id,notrx,idbrg,nama){
    Swal.queue([{
      title: 'Batal Keep ??',
      html: nama,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'keep_ke_gudang_brg' ;
        obj['id'] = id ;
        obj['notrx'] = notrx ;
        obj['id_barang'] = idbrg ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                DetailTrx('g2keep',id);  
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])

  }

  function KeepkeGudang(id){
    Swal.queue([{
      title: 'Batal Keep Barang ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'keep_ke_gudang' ;
        obj['id'] = id ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                LaporanTrx('g2keep');
              } else {
                Swal.fire({type: 'error',title: data})
              }
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])

  }

