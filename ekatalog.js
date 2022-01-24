
  var fileListPO = new Array();

  function eKatTambahBrg() {
    var idbrg = getValueElm('id_barang_project') ;
    var nm = getValueElm('nm_brg_ekat') ;
    var qty = getValueElm('qty_brg_ekat') ;
    var harga = getValueElm('harga_brg_ekat') ;
    var ongkir = getValueElm('ongkir_brg_ekat') ;
    var ket_brg = getValueElm('ket_brg_ekat') ;
    var link_brg = getValueElm('link_brg_ekat') ;
    if (nm=='' || qty=='' || link_brg==''){
      setElmFocus('nm_brg_ekat');
      Swal.fire({type: 'error',title: 'Nama,Quantity & Link Produk tidak boleh kosong'})

      return ;
    }
    if(isNaN(qty)){
      setElmFocus('qty_brg_ekat');
      Swal.fire({type: 'error',title: 'Masukan Quantity Dengan Benar'})

      return ;
    }
    if (idbrg!='') idbrg = parseInt(idbrg);
    if (qty!='') qty = parseInt(qty);
    

    if (idbrg>0 && qty>0){
      var objList = document.getElementById('list_tmp_ekat');
      if (objList!='undefined' && objList!=null){
        var htmlTable = '<tr>'
              + '<td class="hidden" data-tag="id">'+idbrg+'</td>'
              + '<td class="overlapNewLine" data-tag="nama">'+nm+'</td>'
              + '<td style="width: 40px;" align="right" data-tag="qty">'+qty+'</td>'
              + '<td style="width: 90px;" align="right" data-tag="harga">'+harga+'</td>'
              + '<td style="width: 90px;" align="right" data-tag="ongkir">'+ongkir+'</td>'
              + '<td style="width: 150px;" align="left" data-tag="keterangan">'+ket_brg+'</td>'
              + '<td style="width: 140px;" align="left" data-tag="link">'+link_brg+'</td>'
              + '<td style="width: 50px;" align="center"><button id="btn-ekat-hapus" class="btn btn-sm btn-danger waves-effect text-center" onclick="javascript: eKatHapusBrg(this);return false;" >Hapus</button></td>'
              + '</tr>';
        var tableRef = document.getElementById('list_tbl_ekat').getElementsByTagName('tbody')[0];

        //var newRow = tableRef.insertRow(0);
        var newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = htmlTable;
        document.getElementById('input_tmp_ekat').scrollIntoView();       
        addValueElm('id_barang_project',null);
        addValueElm('nm_brg_ekat',null);
        addValueElm('qty_brg_ekat',null);
        addValueElm('harga_brg_ekat',null);
        addValueElm('ongkir_brg_ekat',null);
        addValueElm('ket_brg_ekat',null);
        
        setElmFocus('nm_brg_ekat');

      }

    } else {
      Swal.fire({type: 'error',title: 'Silahkan Isi Data Dengan Benar'})
    }
    
    
  }
  
  function eKatHapusBrg(row){
    swal({
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objList = document.getElementById('list_tbl_ekat');
          if (objList!='undefined' && objList!=null){
            var d = row.parentNode.parentNode.rowIndex;
            document.getElementById('list_tbl_ekat').deleteRow(d);
          }
          resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });
  }

  function SimpanOrderEkatalog(){
    var jmlQty = 0 ;
    var objBarang = [];
    var oTable = document.getElementById('list_tmp_ekat');
    var rowLength = oTable.rows.length;
    for (i = 0; i < rowLength; i++){
      var oCells = oTable.rows.item(i).cells;
      var cellLength = oCells.length;
      var objCell = {};

      for(var j = 0; j < (cellLength-1); j++){
        var tag = oCells.item(j).getAttribute("data-tag") ; 
        var cellVal = oCells.item(j).innerHTML;
        objCell[tag] = cellVal ;
        if (tag=='qty'){
          jmlQty = jmlQty + parseInt(cellVal)
        }
        
      }
      objBarang.push(objCell);
    }
    var jmlItem = objBarang.length ; 
    if (jmlItem>0 && jmlQty>0){

      var objPost = {};
      objPost = PostUserInfo(objPost);
      objPost['kirim'] = 'simpan_order_ekatalog' ;
      objPost['id_paket'] = getValueElm("id_paket")
      objPost['tanggal_po'] = getValueElm("tanggal_po")
      objPost['no_po'] = getValueElm("no_po")
      objPost['tgl_kontrak'] = getValueElm("tgl_kontrak")
      objPost['tgl_batas'] = getValueElm("tgl_batas")
      objPost['satuan_kerja'] = getValueElm("satuan_kerja")
      objPost['pt_cv'] = getValueElm("pt_cv")
      objPost['alamat'] = getValueElm("alamat")
      objPost['kota'] = getValueElm("kota")
      objPost['provinsi'] = getValueElm("provinsi")
      objPost['tanggal_do'] = getValueElm("tanggal_do")
      objPost['no_do'] = getValueElm("no_do")
      objPost['sales'] = getValueElm("sales")
      objPost['tlp_sales'] = getValueElm("tlp_sales")
      objPost['nama_penerima'] = getValueElm("nama_penerima")
      objPost['tlp_penerima'] = getValueElm("tlp_penerima")
      objPost['nama_penerima_ppk'] = getValueElm("nama_penerima_ppk")
      objPost['tlp_penerima_ppk'] = getValueElm("tlp_penerima_ppk")
      objPost['catatan'] = getValueElm("catatan")
      objPost['status_paket'] = getSelectValueElm('status_paket') ;
      objPost['vendor'] = getSelectValueElm('vendor') ;
      objPost['list'] = objBarang
      objPost['DO'] = fileListDO ;
      objPost['PO'] = fileListPO ;

      var fileDokPengiriman = new Array();
      for (index = 0; index < fileListUpload1.length; ++index) {
        var hapus = fileListUpload1[index]['hapus'];
        if (hapus==0){
          fileDokPengiriman.push(fileListUpload1[index])
        }
      }
      objPost['FILE-PENGIRIMAN'] = fileDokPengiriman ;


      var filePendukung = new Array();
      for (index = 0; index < fileListUpload.length; ++index) {
        var hapus = fileListUpload[index]['hapus'];
        if (hapus==0){
          filePendukung.push(fileListUpload[index])
        }
      }
      objPost['FILE-PENDUKUNG'] = filePendukung ;


      SubmitData('Simpan ??',JSON.stringify(objPost),SimpanOrderEkatalogCallback);


    } else {
      Swal.fire({type: 'error',title: 'Masukan Data Barang Dengan Benar'})
    }
    

  }

  function SimpanOrderEkatalogCallback(resData){
    if (resData=='1' || resData=='ok'){
      resetInputOrderEkatalog() 
      SubmitDataStatus('success','Berhasil disimpan');
    } else {
      SubmitDataStatus('error','Gagal Proses <b>'+data+'</b>');      
    }
  }

  function resetInputOrderEkatalog(){
    var obj = document.getElementById('list_tmp_ekat');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML="" ;
    }
    var obj = document.getElementById('prev_name_file');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML="" ;
    }

    var obj1 = document.getElementById('prev_name_file1');
    if (obj1!='undefined' && obj!=null){
      obj1.innerHTML="" ;
    }

    addValueElm('id_paket',null);
    addValueElm('no_po',null);
    addValueElm('tgl_kontrak',null);
    addValueElm('tgl_batas',null);
    addValueElm('tanggal_po',null);
    addValueElm('pt_cv',null);
    addValueElm('satuan_kerja',null);
    addValueElm('alamat',null);
    addValueElm('kota',null);
    addValueElm('provinsi',null);
    addValueElm('no_do',null);
    addValueElm('sales',null);
    addValueElm('tlp_sales',null);
    addValueElm('nama_penerima',null);
    addValueElm('tlp_penerima',null);
    addValueElm('catatan',null);
    fileListDO = new Array();
    fileListPO = new Array();
    fileListUpload = new Array();
    fileListUpload1 = new Array();
    setElmFocus('id_paket');

  }


  function handleFilesPO(files) {
    files = [...files]
    fileListPO = [] ;
    files.forEach(previewFilePO)
  }

  function previewFilePO(file) {
    var nmFile = file.name;
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      var obj = {};
      obj['base64'] = reader.result ;
      obj['name'] = nmFile ;
      fileListPO.push(obj)
      var objBtn = document.getElementById('btn_f_po');
      if (objBtn!='undefined' && objBtn!=null){
        objBtn.innerHTML="ganti";
      }
    }
  }


  function InfoProsesPaketEkatalog(tag,nPage){
    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/ekatalog/proses_view.php' ;
     
      var cari = getValueElm('cari') ;
      var param = 'tag='+tag+'&page='+page+'&cari='+cari;
      if (tag=='all' || tag=='status'){
        param = param+'&tag-cari='+getSelectValueElm('tag-cari') ;
        if (tag=='all' ){
          param = param+'&tag-prj='+getSelectValueElm('tag-cari-type') ;
        }
      }

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            //document.getElementById("view_list").scrollIntoView();
          }          
          ReloadJsFunc()
        };
      };
      xmlHttp.send(param);
    }
  }

  function ExcelProsesPaketEkatalog(tag){
    var params = {} ;
    params.uid = getUserInfo('id');
    params.akses = getUserInfo('id_akses');
    params.tag = tag ;
    params.cari = getValueElm('cari') ;
    //params.tanggal = getValueElm('tag-cari') ;
    if (tag=='all' || tag=='status'){
        params.proses = getSelectValueElm('tag-cari') ;
        if (tag=='all' ){
          params.project = getSelectValueElm('tag-cari-type') ;
        }
    }
    OpenWindowWithPost('aplikasi/ekatalog/proses_excel.php', "", "karyawan", params);
  }

  function PdfProsesPaketEkatalog(tag){
    var params = {} ;
    params.uid = getUserInfo('id');
    params.akses = getUserInfo('id_akses');
    params.tag = tag ;
    params.cari = getValueElm('cari') ;
    //params.tanggal = getValueElm('tag-cari') ;
    if (tag=='all' || tag=='status'){
        params.proses = getSelectValueElm('tag-cari') ;
        if (tag=='all' ){
          params.project = getSelectValueElm('tag-cari-type') ;
        }
    }
    OpenWindowWithPost('aplikasi/ekatalog/proses_pdf.php', "", "karyawan", params);
  }

  function PdfProsesPaketEkatalogDetail(tag){
    var params = {} ;
    params.uid = getUserInfo('id');
    params.akses = getUserInfo('id_akses');
    params.tag = tag ;
    params.cari = getValueElm('cari') ;
    //params.tanggal = getValueElm('tag-cari') ;
    if (tag=='all' || tag=='status'){
        params.proses = getSelectValueElm('tag-cari') ;
        if (tag=='all' ){
          params.project = getSelectValueElm('tag-cari-type') ;
        }
    }
    OpenWindowWithPost('aplikasi/ekatalog/lap_detail_pdf.php', "", "karyawan", params);
  }
  
  function SelesaiProsesBarangEkatalog(id,tag){
    if (tag=='gudang'){
      var buttonsPlus = $('<div>')
      .append(createButton('Kirim ke Teknisi','sw_teknisi','btn-primary'))
      .append(createButton('Kirim ke QC','sw_qc','btn-success'))
      .append('<br/>')
      .append(createButton('Kirim ke Gudang Expedisi','sw_exp','btn-danger'))
      .append(createButton('Batal','sw_batal',''));

      swal({
        html: buttonsPlus,
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_teknisi').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'teknisi'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });
            
            swal.close();
          });
          $('#sw_qc').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'qc'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });

            swal.close();
          });
          $('#sw_exp').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'exp'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });
            
            swal.close();
          });
          
        }
      });
    } else if (tag=='teknisi'){
      var buttonsPlus = $('<div>')
      .append(createButton('Kirim ke Gudang','sw_gudang','btn-primary'))
      .append(createButton('Kirim ke QC','sw_qc','btn-success'))
      .append(createButton('Batal','sw_batal',''));

      swal({
        html: buttonsPlus,
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_gudang').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'gudang'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });
            
            swal.close();
          });
          $('#sw_qc').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'qc'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });

            swal.close();
          });
          
          
        }
      });
      /* batas teknisi */
    } else if (tag=='qc'){
      var buttonsPlus = $('<div>')
      .append(createButton('Sesuai Spec','sw_sesuai','btn-primary'))
      .append(createButton('Tidak Sesuai Spec','sw_tidak','btn-warning'))
      .append(createButton('Batal','sw_batal',''));

      swal({
        html: buttonsPlus,
        type: 'question',
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_sesuai').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'gudang'
            objPost['status'] = 'sesuai'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });
            
            swal.close();
          });
          $('#sw_tidak').on('click',function () {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-barang-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
            objPost['ke'] = 'qc'
            objPost['status'] = 'beda'

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              }
            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
            });

            swal.close();
          });
          
          
        }
      });
    } else {
      var infoTanya = 'Simpan ??'
      swal({
        title: infoTanya,
        html: '<label class="text-red">Pastikan barang sudah sesuai kontrak / pesanan</label>',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        showLoaderOnConfirm: true,
        preConfirm: function(result) {
          return new Promise(function(resolve, reject) {
            if (result) {
              var objPost = {};
              objPost = PostUserInfo(objPost);
              objPost['kirim'] = 'update-proses-barang-ekatalog' ;
              objPost['id'] = id
              objPost['tag'] = tag
          

              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  InfoProsesPaketEkatalog(tag) 

                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses err '+resData})
              });
              //resolve();
            }
          });
        },
        allowOutsideClick: () => $swal.isLoading(),
      })

    }
    
  }

  function CancelSelesaiProsesBarangEkatalog(id,tag){
    Swal.fire({
      title: 'Catatan',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Cancel Barang',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'update-proses-barang-ekatalog-cancel' ;
        obj['id'] = id ;
        obj['tag'] = tag ;
        obj['keterangan'] = keterangan ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan')   ;
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
    })

  }


  function RubahBrgProject(id,tag){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4']
    }).queue([
      'Quantity','Harga','Ongkir','Keterangan'
    ]).then((result) => {
      if (result.value) {
        var qty = result.value[0] ;
        var harga = result.value[1] ;
        var ongkir = result.value[2] ;
        var ket = result.value[3] ;
        if (qty!=''){
          UpdateRubahBrgProject(id,tag,qty,harga,ongkir,ket) ;  
        }
        
      }
    })

  }
  
  function UpdateRubahBrgProject(id,tag,qty,harga,ongkir,ket){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['id'] = id ;
    obj['tag'] = tag ;
    obj['qty'] = qty ;
    obj['harga'] = harga ;
    obj['ongkir'] = ongkir ;
    obj['keterangan'] = ket ;
    obj['kirim'] = 'rubah-barang-project' ;

    SubmitData('Rubah Barang Project ??',JSON.stringify(obj),CallbackTagStatus);
  }




  function HapusBrgProject(id,tag){
    Swal.fire({
      title: 'Catatan',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Hapus Barang',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'hapus-barang-project' ;
        obj['id'] = id ;
        obj['tag'] = tag ;
        obj['keterangan'] = keterangan ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                InfoProsesPaketEkatalog(tag);
                SwalPopupSuccess('Berhasil disimpan')   ;
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
    })

  }

  function FormInputQtyReqOrder(id,tag){
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
          UpdateInputQtyReqOrder(id,tag,qty,ket) ;  
        }
        
      }
    })
  }
  function UpdateInputQtyReqOrder(id,tag,qty,ket){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['id'] = id ;
    obj['tag'] = tag ;
    obj['qty'] = qty ;
    obj['keterangan'] = ket ;
    obj['kirim'] = 'update-proses-gudang-req-barang' ;
    SubmitData('Request Barang untuk di Order ??',JSON.stringify(obj),CallbackTagGudang);
  }



  function UpdateCancelReqOrder(id,tag){
     Swal.queue([{
        title: 'Permintaan Barang ke Purcasing di Batalkan ??',
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
          obj['kirim'] = 'update-cancel-gudang-req-barang' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  InfoProsesPaketEkatalog(tag)
                  //DetailTrx(tag,Notrx);
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

  function inputCatatanBarangEkatalog(id,tag){
    Swal.fire({
      title: 'Catatan',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'update-proses-catatan-barang-ekatalog' ;
        obj['id'] = id ;
        obj['tag'] = tag ;
        obj['keterangan'] = keterangan ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                InfoProsesPaketEkatalog(tag) 
                SwalPopupSuccess('Berhasil disimpan')   ;
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
    })
  }

  function SelesaiProsesPaketEkatalog(id,tag){
    var infoTanya = 'Sudah Selesai ??'
    swal({
      title: infoTanya,
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      showLoaderOnConfirm: true,
      preConfirm: function(result) {
        return new Promise(function(resolve, reject) {
          if (result) {
            var objPost = {};
            objPost = PostUserInfo(objPost);
            objPost['kirim'] = 'update-proses-ekatalog' ;
            objPost['id'] = id
            objPost['tag'] = tag
        

            axios.post(urlDB, objPost )
            .then(function (res) {
              var resData = res.data ;
              if (resData=='1' || resData=='ok'){
                InfoProsesPaketEkatalog(tag) 

                SwalPopupSuccess('Berhasil disimpan ')   ;
              } else {
                Swal.fire({type: 'error',title: resData})
              }

            })
            .catch(function (err) {
              Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
            });
            //resolve();
          }
        });
      },
      allowOutsideClick: () => $swal.isLoading(),
    })
  }

  function viewExpedisiEkatalog(tag,id){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'view_file_ekatalog' ;
    obj['id'] = id ;
    obj['tag'] = tag ;
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          LoadingProgress(false);
          var json = JSON.parse(data);
          var filePath = json['list']['path'];
          var url = urlHome+'file_upload/EKATALOG/'+filePath
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



  function PengajuanDOeKatalog(id,tag){
    var htmlInput = '<input type="text" id="tanggal" name="tanggal" class="swal2-input">';
    htmlInput += '<textarea type="text" class="swal2-input " rows="8" id="catatan" placeholder="Keterangan"></textarea>';
    htmlInput += '<input type="file" id="foto" onchange="handleUpload(this.files)" >';
    swal({
      title: 'Pengajuan DO',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function() {

        $('input[name="tanggal"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload-pengajuan-do-ekatalog' ;
          objPost['id'] = id
          objPost['tanggal'] = getValueElm("tanggal")
          objPost['catatan'] = getValueElm("catatan")
          objPost['file'] = fileListUpload ;

          Swal.fire({
            title: 'Proses Pengajuan DO ?',
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
                  InfoProsesPaketEkatalog(tag) 

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

  function UploadDOeKatalog(id,tag){
    var htmlInput = '<input type="text" id="no_do" name="no_do" class="swal2-input" placeholder="Nomor DO">';
    htmlInput += '<input type="file" id="foto" onchange="handleUpload(this.files)" >';
    swal({
      title: 'Proses DO Paket',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload-do-ekatalog' ;
          objPost['id'] = id
          objPost['no_do'] = getValueElm("no_do")
          objPost['file'] = fileListUpload ;

          Swal.fire({
            title: 'Upload DO ?',
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
                  InfoProsesPaketEkatalog(tag) 

                  fileListRESI = new Array();
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

  function UploadPOeKatalog(id,tag){
    var htmlInput = '<input type="text" id="no_po" name="no_po" class="swal2-input" placeholder="Nomor PO">';
    htmlInput += '<input type="file" id="foto" onchange="handleUpload(this.files)" >';
    swal({
      title: 'Proses PO Paket',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload-po-ekatalog' ;
          objPost['id'] = id
          objPost['no_po'] = getValueElm("no_po")
          objPost['file'] = fileListUpload ;

          Swal.fire({
            title: 'Upload PO ?',
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
                  InfoProsesPaketEkatalog(tag) 
                  fileListRESI = new Array();
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

  function eKatalogKeExpedisi(id,id_detail){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['tag'] = 'ekatalog' ;
    p_obj['id'] = id ;
    if (id_detail!='undefined' && id_detail!=null){
      p_obj['detail-produk'] = id_detail ;
    } else {
      p_obj['detail-produk'] = 0 ;
    }
    runXHR('aplikasi/expedisi/jadwal_pengiriman.php',p_obj,eKatalogKeExpedisiCallback);
  }
  function eKatalogKeExpedisiCallback(data){
    var obj = document.getElementById('main-content');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML = data;
    } else {
      PopupModalHtml(data);
    }
    ReloadJsFunc();

  }
  /*
  function eKatalogKeExpedisiXX(id){
    setMenuActive('expedisi_jadwal_pengiriman')
    var url = 'aplikasi/expedisi/jadwal_pengiriman.php' ;
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      //
      var obj = document.getElementById('main-content');
      if (obj!='undefined' && obj!=null){
        LoadingProgress(true);
        obj.innerHTML= htmlLoading
        var param = 'tag=ekatalog&id='+id;


        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            LoadingProgress(false);
            if (obj!='undefined' && obj!=null){
              obj.innerHTML = xmlHttp.responseText;
            }
            ReloadJsFunc()
          };
        };
        xmlHttp.send(param);
      }
    }
  }
  */

  function SubmitPenawaran(id,tag){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'submit-status-penawaran' ;
    obj['id'] = id ;
    obj['tag'] = tag ;
    if (tag=="purchasing"){
      SubmitData('Ajukan Penawaran Harga ??',JSON.stringify(obj),CallbackTagPurchasing);
    } else if (tag=="expedisi"){ 
      SubmitData('Ajukan Penawaran Harga ??',JSON.stringify(obj),CallbackTagExpedisi);
    }
    
  }

  function AjukanPermohonanPenawaran(id){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'upload-status-permohonan-penawaran' ;
    obj['id'] = id ;
    SubmitData('Buat Permohonan Penawaran  ??',JSON.stringify(obj),CallbackTagStatus);
  }

  function AjukanPenawaran(id,tag){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1','2']
    }).queue([
      'Harga','Catatan'
    ]).then((result) => {
      if (result.value) {
        var harga = result.value[0] ;
        var ket = result.value[1] ;
        if (harga!=''){
          var obj = {};
          obj = PostUserInfo(obj);
          obj['id'] = id ;
          obj['tag'] = tag ;
          obj['harga'] = harga ;
          obj['keterangan'] = ket ;
          obj['kirim'] = 'penawaran-barang-project' ;
          if (tag=="purchasing"){
            SubmitData('Simpan ??',JSON.stringify(obj),CallbackTagPurchasing);
          } else if (tag=="expedisi"){ 
            SubmitData('Simpan ??',JSON.stringify(obj),CallbackTagExpedisi);
          }
          
        }
        
      }
    })

  }

  

  function CallbackTagPurchasing(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('purchasing')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagExpedisi(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('expedisi')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagGudang(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('gudang')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }

  function CallbackTagQC(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('qc')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagFinance(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('finance')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagAdmin(data,txt){
    if (data=='1' || data=='ok'){
      InfoProsesPaketEkatalog('admin')
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagStatus(data,txt){
    if (data=='1' || data=='ok'){
      if (txt=="bukti_bayar" || txt=="bukti_potong"){
        InfoProsesPaketEkatalog('finance')
        txt = "";
      } else {
        InfoProsesPaketEkatalog('status')  
      }

      
      if (txt!='undefined' && txt!=null && txt!=''){
        
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil disimpan');
      }
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }
  function CallbackTagStatusHapus(data,txt,tag){
    if (data=='1' || data=='ok'){
      if (tag!='undefined' && tag!=null){
        InfoProsesPaketEkatalog(tag);
      } else {
        InfoProsesPaketEkatalog('status')  
      }

      
      if (txt!='undefined' && txt!=null){
        SubmitDataStatus('success',txt);
      } else {
        SubmitDataStatus('success','Berhasil di Hapus');  
      }
      
    } else {
      SubmitDataStatus('error','<b>'+data+'</b>');      
    }
  }






  
  function UpdateStatusEkatalog(id,tag){
    Swal.fire({
      title: 'Update Catatan Paket',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'upload-status-dokumen-ekatalog' ;
        obj['id'] = id ;
        obj['keterangan'] = keterangan ;
        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoProsesPaketEkatalog(tag) 
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
    })
  }

  function UpdateProsesBarangEkatalogProses(id,tag,actionTag){
    var infoTanya = 'Mulai Persiapkan Barang ?? '+actionTag ;
    var htmlInput = '<div class="row">'
                      +'<div class="col-md-12">'
                        +'<div class="form-group text-left my-1">'
                          +'<span class="text-gray">Tanggal Sepakat</span>'
                          +'<input type="text" id="tanggal_sepakat" name="tanggal_sepakat" class="swal2-input my-1" placeholder="Tgl Kontrak">'
                        +'</div>'
                      +'</div>'

                      +'<div class="col-md-6">'
                        +'<div class="form-group text-left my-1">'
                          +'<span class="text-gray">Tanggal Kontrak</span>'
                          +'<input type="text" id="tanggal_mulai" name="tanggal_mulai" class="swal2-input my-1" placeholder="Tgl Kontrak">'
                        +'</div>'
                      +'</div>'

                      +'<div class="col-md-6">'
                        +'<div class="form-group text-left my-1">'
                          +'<span class="text-gray">Tanggal Akhir Kontrak</span>'
                          +'<input type="text" id="tanggal_selesai" name="tanggal_selesai" class="swal2-input my-1" placeholder="Berakhir Kontrak">'
                        +'</div>'
                      +'</div>'

                      +'<div class="col-md-12">'
                        + '<textarea type="text" class="swal2-input p-2 " rows="4" id="catatan" placeholder="Keterangan"></textarea>';
                      +'</div>'
                    +'</div>';
    swal({
      title: "Paket Sepakat",
      html: htmlInput,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      onOpen: function() {

        $('input[name="tanggal_sepakat"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_sepakat"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

        $('input[name="tanggal_mulai"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_mulai"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

        $('input[name="tanggal_selesai"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_selesai"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
            
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload-status-proses-ekatalog' ;
          objPost['id'] = id ;
          objPost['tag'] = actionTag ;
          objPost['sepakat'] = getValueElm("tanggal_sepakat")
          objPost['mulai'] = getValueElm("tanggal_mulai")
          objPost['selesai'] = getValueElm("tanggal_selesai")

          SubmitData(infoTanya,JSON.stringify(objPost),CallbackTagStatus);
          /*
          Swal.fire({
            title: infoTanya,
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  InfoProsesPaketEkatalog(tag) 
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
              });

            }
          })
          */
          //resolve();
        });
      }
    }).then((data) => {
      console.log(data);
    });
   
  }

  function UpdateReProsesEkatalog(id,tag,actionTag){

    Swal.fire({
      title: 'Catatan Lanjut Proses Paket',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Lanjut Proses ??',
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'upload-status-proses-ekatalog' ;
        obj['id'] = id ;
        obj['tag'] = actionTag ;
        obj['keterangan'] = keterangan ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoProsesPaketEkatalog('status') 
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
    })
  }

  function UpdateProsesBarangEkatalog(id,tag,actionTag){
    var infoTanya = 'Mulai Persiapkan Barang ?? ' ;
    var infoCatatan = 'Catatan ' ;
    if (actionTag=='pending') {
      infoTanya = 'Pending Paket'
      infoCatatan = 'Catatan Pending' ;
    } else if (actionTag=='hapus') {
      infoTanya = 'Hapus Paket'
      infoCatatan = 'Catatan Hapus Paket' ;
    } else {
      UpdateProsesBarangEkatalogProses(id,tag,actionTag);
      return;

    }

    Swal.fire({
      title: infoCatatan,
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: infoTanya,
      showLoaderOnConfirm: true,
      preConfirm: (ket) => {
        var keterangan = `${ket}` ;

        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'upload-status-proses-ekatalog' ;
        obj['id'] = id ;
        obj['tag'] = actionTag ;
        obj['keterangan'] = keterangan ;

        //SubmitData('Paket Batal ??',JSON.stringify(objPost),CallbackTagStatus);

        
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                InfoProsesPaketEkatalog('status') 
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
    })

  }

  function UpdateProsesBarangNonEkatalog(id,tag,actionTag){
    var infoTanya = 'Mulai Persiapkan Barang ?? '+actionTag ;
    var htmlInput = '<div class="row">'
                      +'<div class="col-md-6">'
                        +'<div class="form-group text-left my-1">'
                          +'<span class="text-gray">Tanggal Kontrak</span>'
                          +'<input type="text" id="tanggal_mulai" name="tanggal_mulai" class="swal2-input my-1" placeholder="Tgl Kontrak">'
                        +'</div>'
                      +'</div>'

                      +'<div class="col-md-6">'
                        +'<div class="form-group text-left my-1">'
                          +'<span class="text-gray">Tanggal Akhir Kontrak</span>'
                          +'<input type="text" id="tanggal_selesai" name="tanggal_selesai" class="swal2-input my-1" placeholder="Berakhir Kontrak">'
                        +'</div>'
                      +'</div>'

                      +'<div class="col-md-12">'
                        + '<textarea type="text" class="swal2-input p-2 " rows="4" id="catatan" placeholder="Keterangan"></textarea>';
                      +'</div>'
                    +'</div>';
    swal({
      html: htmlInput,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      showCancelButton: true,
      onOpen: function() {

       

        $('input[name="tanggal_mulai"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_mulai"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

        $('input[name="tanggal_selesai"]').daterangepicker({
          singleDatePicker: true,
          timePicker: false,
          showDropdowns: true,
          drops: "down",
          opens: "right",
          locale: {
            format: 'YYYY-MM-DD'
          }
        }, 
        function(start, end, label) {
          $('input[name="tanggal_selesai"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
            
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload-status-proses-ekatalog' ;
          objPost['id'] = id ;
          objPost['tag'] = actionTag ;
          objPost['sepakat'] = getValueElm("tanggal_sepakat")
          objPost['mulai'] = getValueElm("tanggal_mulai")
          objPost['selesai'] = getValueElm("tanggal_selesai")

          SubmitData(infoTanya,JSON.stringify(objPost),CallbackTagStatus);
        });
      }
    }).then((data) => {
      console.log(data);
    });
  }

  function uploadSjJuksung(id,tag){
    var htmlInput = '<input type="text" id="no" class="swal2-input" placeholder="Nomor Surat Jalan">';
    htmlInput += '<input type="file" id="foto" onchange="handleFilesSJ(this.files)" >';
    swal({
      title: 'Surat Jalan Juksung',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'ekatalog_upload_sj' ;
          objPost['id'] = id
          objPost['no'] = getValueElm("no")
          objPost['file'] = fileListSJ ;
          

          Swal.fire({
            title: 'Simpan Surat Jalan ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  
                  fileListSJ = new Array();
                  InfoProsesPaketEkatalog(tag)
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



  function uploadEkatalogDoKembali(id,tag){
    var htmlInput = '<input type="text" id="no_do" name="no_do" class="swal2-input" placeholder="Nomor DO">';
    htmlInput += '<input type="file" id="foto" onchange="handleUpload(this.files)" >';
    swal({
      title: 'DO Kembali',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'ekatalog_upload_do_kembali' ;
          objPost['id'] = id
          objPost['no_do'] = getValueElm("no_do")
          objPost['file'] = fileListUpload ;

          Swal.fire({
            title: 'Upload DO Kembali ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                if (resData=='1' || resData=='ok'){
                  InfoProsesPaketEkatalog(tag) 

                  fileListRESI = new Array();
                  SwalPopupSuccess('Berhasil disimpan ')   ;
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses '+resData})
                }

              })
              .catch(function (err) {
                Swal.fire({type: 'error',title: 'Gagal Proses '+err})
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

  function statusPaketEkatalog(){
    var sts = getSelectValueElm('status_paket') ;
    if (sts=='juksung'){
      addValueElm('id_paket',null);
      addValueElm('no_do',null);
      document.getElementById('id_paket').disabled = true;
      document.getElementById('no_do').disabled = true;
      document.getElementById('btn_f_do').disabled = true;
      
      //addValueElm('vendor',null);
      $("#form_pilih_vendor").addClass("hidden");  
    } else {
      document.getElementById('id_paket').disabled = false;
      document.getElementById('no_do').disabled = false;
      document.getElementById('btn_f_do').disabled = false;
      $("#form_pilih_vendor").removeClass("hidden");  
    }
    

  }


  function LapStatusDO(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/ekatalog/lap_do_view.php' ;
      var cari = getValueElm('cari') ;
      var param = 'cari='+cari+'&tag-cari='+getSelectValueElm('tag-cari') ;
      if (tag=='excel'){
        var params = {} ;
        params.uid = getUserInfo('id');
        params.akses = getUserInfo('id_akses');
        params.cari = cari
        params.cari1 = getSelectValueElm('tag-cari') ;
        OpenWindowWithPost('aplikasi/ekatalog/lap_do_excel.php', "", "karyawan", params);  
      } else {
        var obj = document.getElementById('view_list');
        obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (obj!='undefined' && obj!=null){
              obj.innerHTML = xmlHttp.responseText;
            }          
          };
        };
        xmlHttp.send(param);
      }
    }
  }

  function LapStatusJuksung(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/ekatalog/lap_juksung_view.php' ;
      var cari = getValueElm('cari') ;
      var param = 'cari='+cari+'&tag-cari='+getSelectValueElm('tag-cari') ;
      if (tag=='excel'){
        var params = {} ;
        params.uid = getUserInfo('id');
        params.akses = getUserInfo('id_akses');
        params.cari = cari
        params.cari1 = getSelectValueElm('tag-cari') ;
        OpenWindowWithPost('aplikasi/ekatalog/lap_juksung_excel.php', "", "karyawan", params);  
      } else {
        var obj = document.getElementById('view_list');
        obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (obj!='undefined' && obj!=null){
              obj.innerHTML = xmlHttp.responseText;
            }          
          };
        };
        xmlHttp.send(param);
      }
    }
  }

  function LapStatusBarang(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/ekatalog/lap_brg_view.php' ;
      var cari = getValueElm('cari') ;
      var param = 'cari='+cari+'&tag-cari='+getSelectValueElm('tag-cari') ;
      if (tag=='excel'){
        var params = {} ;
        params.uid = getUserInfo('id');
        params.akses = getUserInfo('id_akses');
        params.cari = cari
        params.cari1 = getSelectValueElm('tag-cari') ;
        OpenWindowWithPost('aplikasi/ekatalog/lap_brg_excel.php', "", "karyawan", params);  
      } else {
        var obj = document.getElementById('view_list');
        obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (obj!='undefined' && obj!=null){
              obj.innerHTML = xmlHttp.responseText;
            }          
          };
        };
        xmlHttp.send(param);
      }
    }
  }

  function LapStatusKirimEkat(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/ekatalog/lap_kirim_view.php' ;
      var cari = getValueElm('cari') ;
      var param = 'cari='+cari+'&tag-cari='+getSelectValueElm('tag-cari') ;
      if (tag=='excel'){
        var params = {} ;
        params.uid = getUserInfo('id');
        params.akses = getUserInfo('id_akses');
        params.cari = cari
        params.cari1 = getSelectValueElm('tag-cari') ;
        OpenWindowWithPost('aplikasi/ekatalog/lap_kirim_excel.php', "", "karyawan", params);  
      } else {
        var obj = document.getElementById('view_list');
        obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;
        xmlHttp.open("POST", url , true);
        xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            if (obj!='undefined' && obj!=null){
              obj.innerHTML = xmlHttp.responseText;
            }          
          };
        };
        xmlHttp.send(param);
      }
    }
  }

  function ProjectUploadDokumenSepakat(id) {
    fileListUpload = new Array();
    var htmlInput = '<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                    +'<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih Dokumen Sepakat</button>';
    swal({
      title: 'Dokumen Sepakat',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function (dObj) { 
          $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
          });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_dok_ekatalog_sepakat' ;
          objPost['id'] = id
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          fileListUpload = new Array();

          SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagStatus);

        });
      }
    }).then((data) => {
      //console.log(data);
    });
  }

  function ProjectUploadDokumenPengiriman(id) {
    fileListUpload = new Array();
    var htmlInput = '<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                    +'<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih Dokumen Pengiriman</button>';
    swal({
      title: 'Dokumen Pengiriman',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function (dObj) { 
          $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
          });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_dok_ekatalog_pengiriman' ;
          objPost['id'] = id
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          fileListUpload = new Array();

          SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagStatus);
        });
      }
    }).then((data) => {
      //console.log(data);
    });
  }

  function ProjectUploadDokumenAdmin(id) {
    fileListUpload = new Array();
    var htmlInput = '<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                    +'<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih Dokumen Admin</button>';
    swal({
      title: 'Dokumen Admin',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function (dObj) { 
          $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
          });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_dok_ekatalog_admin' ;
          objPost['id'] = id
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          fileListUpload = new Array();

          SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagAdmin);
        });
      }
    }).then((data) => {
      //console.log(data);
    });
  }
  function ProjectUploadDokumenFinance(id,tag) {
    fileListUpload = new Array();
    var judul = 'Dokumen Finance' ;
    var htmlInput = '<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                  + '<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih File</button>';  
    if (tag!='undefined' && tag!=null){
      if (tag=='bukti_bayar'){
        judul = 'Bukti Bayar' ;
      } else if (tag=='bukti_potong'){
        judul = 'Bukti Potong' ;
      }
    }
    swal({
      title: judul,
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function (dObj) { 
          $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
          });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_dok_ekatalog_finance' ;
          objPost['id'] = id;
          objPost['tag'] = tag ;
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          fileListUpload = new Array();

          SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagFinance);
        });
      }
    }).then((data) => {
      //console.log(data);
    });
  }

  function UpdateProsesEkatalog(id,tag){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'update_bidang_ekatalog' ;
    obj['id'] = id ;
    obj['tag'] = tag ;
    
    var tanya = 'Selesai ??' ;
    if (tag=='finance'){
      SubmitData(tanya,JSON.stringify(obj),CallbackTagFinance);
    } else if (tag=='admin'){
      SubmitData(tanya,JSON.stringify(obj),CallbackTagAdmin);
    }

    
  }
  

  function hapusDokEkatalog(id,tag) {
    var objPost = {};
    objPost = PostUserInfo(objPost);
    objPost['kirim'] = 'hapus_dok_ekatalog' ;
    objPost['id'] = id
    if (tag=='gudang'){
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagGudang,'Dokumen Berhasil di Hapus','status');  
    } else if (tag=='gudang'){
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagQC,'Dokumen Berhasil di Hapus','status');  
    } else if (tag=='admin'){
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagAdmin,'Dokumen Berhasil di Hapus','status');  
    } else if (tag=='finance'){
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagFinance,'Dokumen Berhasil di Hapus','status');  
    } else if (tag=='qc'){
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagQC,'Dokumen Berhasil di Hapus','status');  
    } else {
      SubmitData('Hapus Dokumen ??',JSON.stringify(objPost),CallbackTagStatusHapus,'Dokumen Berhasil di Hapus','status');  
    }
    
  }

  function UploadFileEkatalogDetail(id,tag){
    fileListUpload = new Array();
    var htmlInput = '<div class="card"><div class="d-flex"><div class="row py-2 px-4" id="prev_name_file"></div></div></div>'
                    +'<button class="btn btn-block btn-danger btn-sm waves-effect text-center" id="tmp_pilih_file">Pilih Dokumen</button>';
    swal({
      title: 'Dokumen Pendukung',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function (dObj) { 
          $('#tmp_pilih_file').on('click',function () {
            $('#F_UPLOAD').trigger('click'); 
          });
      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_dok_ekatalog_detail' ;
          objPost['id'] = id
          objPost['tag'] = tag
          objPost['FILE-PENDUKUNG'] = fileListUpload ;
          fileListUpload = new Array();
          if (tag=='gudang'){
            SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagGudang,'Dokumen SN berhasil di Upload');  
          } else if (tag=='qc'){
            SubmitData('Simpan Dokumen ??',JSON.stringify(objPost),CallbackTagQC,'Dokumen QC berhasil di Upload');  
          }
          
        });
      }
    }).then((data) => {
      //console.log(data);
    });

  }

  function InfoHistoryProject(id){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;
    runXHR('aplikasi/ekatalog/info-history.php',p_obj,PopupModalHtml);
  }


  function InfoDetailProjectEkatalog(tag,nPage){

    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }

    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['tag'] = tag ;
    p_obj['page'] = page ;
    p_obj['cari'] = getValueElm('cari') ;

    if (tag=='all' || tag=='status'){
      p_obj['tag-cari'] = getSelectValueElm('tag-cari') ;
      if (tag=='all' ){
        p_obj['tag-prj'] = getSelectValueElm('tag-cari-type') ;
      }
    }

    runXHR('aplikasi/ekatalog/lap_detail_view.php',p_obj,InfoDetailProjectEkatalogCallBack);
  }



  function InfoDetailProjectEkatalogCallBack(data){
    var obj = document.getElementById('view_list');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML = data;
    } else {
      PopupModalHtml(data);
    }
    ReloadJsFunc();

  }

  function ViewLaporanEkatJatuhTempo(tag,nPage){
    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }

    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['tag'] = tag ;
    p_obj['bulan'] = getValueElm('tanggal') ;
    p_obj['page'] =page ;

    runXHR('aplikasi/ekatalog/lap_view.php',p_obj,ViewLaporanEkatJatuhTempoCallBack);

  }

  function ViewLaporanEkatJatuhTempoCallBack(data){
    var obj = document.getElementById('view_list');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML = data;
    } else {
      PopupModalHtml(data);
    }
    ReloadJsFunc();

  }


  function CetakDoPoEkatalog(id,tag){
        var p_obj = {};
        p_obj = PostUserInfo(p_obj);
        p_obj['tag'] = tag ;
        p_obj['id'] = id ;
        runXHR('aplikasi/cetak/index.php',p_obj,CetakDoPoEkatalogCallback,tag,id);
    }

    function CetakDoPoEkatalogCallback(data,tag,id){
        var obj = document.getElementById('main-content');
        if (obj!='undefined' && obj!=null){
            obj.innerHTML = data;
            ReloadJsFunc();
            if (tag!='undefined' && tag!=null){
                  addDataCetakPoDoEkatalogQry(tag,id);
            }
        } else {
          PopupModalHtml(data);
        }
    }


    function addDataCetakPoDoEkatalogQry(tag,id){
        EntryCetak(tag);
        id_tmp_tbl = 0 ;
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "cari_data_ekatalog";
        obj['id'] = id;
        $.post(urlDB,obj,
            function(data,status){
                var dataAry = JSON.parse(data);
                
                addValueElm('no_po',dataAry['id_paket'])   
                addValueElm('id_tmp_transaksi',dataAry['id']) 

                var listAry = dataAry['detail_barang'] ;
                var htmlTable = '' ;
                for (var i=0 ; i<listAry.length ; i+=1){
                    var SingleArray = listAry[i];

                    addValueElm('note',SingleArray['keterangan'])
                    addDataCetakPoDoEkatalog(tag,SingleArray['id_barang'],SingleArray['harga'],SingleArray['quantity']);
                }
            } 
        );  
    }
    function addDataCetakPoDoEkatalog(tag,id_brg,harga,qty){
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "data_barang";
        obj['tag-request'] = "permintaan";
        obj['id'] = id_brg;
        $.post(urlDB,obj,
            function(data,status){
              
                id_tmp_tbl++ ;
                var btn = '<a href="#" onclick="Javascript: DeleteRowTblTrx(\''+tag+'\',\'tbl_'+id_tmp_tbl+'\'); return false ;" class="label label-danger"><i class="ti-trash"></i></a>';

                var dataAry = JSON.parse(data);
                var listAry = dataAry['list'][0]
                var sHtml = ''

                if ( ListSnTrx!='undefined' &&  ListSnTrx!=null) {
                    noSN = ListSnTrx ;
                } else {
                    if (noSN!=''){
                        noSN = noSN.replace(/(?:\r\n|\r|\n)/g, '<br>');
                    }
                }
                ListSnTrx = "";
              
                var infoBarang = '<a href="#" onclick="Javascript: KartuStock('+listAry['id']+'); return false ;">'+listAry['nama']+'</a>';

                sHtml += '<td class="hidden">'+listAry['id']+'</td>'
                sHtml += '<td class="overlapNewLine">'+infoBarang+'</td>'
                sHtml += '<td align="right" style="width:110px;">'+number_format(harga)+'</td>'
                sHtml += '<td align="right" style="width:70px;">'+number_format(qty)+'</td>'
                sHtml += '<td class="hidden"></td>'
                sHtml += '<td class="hidden"></td>'
                sHtml += '<td align="center" style="width:60px;">'+btn+'</td>'

                $('#list_tbl').append('<tr id=tbl_'+id_tmp_tbl+'>'+sHtml+'</tr>');
                hitungInputCetakBarang(tag)
                document.getElementById('input_qty').innerHTML='' ;
                addValueElm('cari_barcode',null);
                addValueElm('id_barang',null);
                setElmFocus('cari_barcode');
                LoadingProgress(false);

            } 
        );  
    }


  


  function CetakInvoicePrj(id,tag){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['tag'] = tag ;
    p_obj['id'] = id ;
    runXHR('aplikasi/cetak/invoice.php',p_obj,CetakInvoiceCallback,tag,id);
  }

  function CetakInvoiceCallback(data,tag,id){
    var obj = document.getElementById('main-content');
    if (obj!='undefined' && obj!=null){
        obj.innerHTML = data;
        ReloadJsFunc();
        if (tag!='undefined' && tag!=null){
              addDataCetakInvoiceEkatalogQry(tag,id);
        }
    } else {
      PopupModalHtml(data);
    }
  }


  function addDataCetakInvoiceEkatalogQry(tag,id){
    EntryCetak(tag);
    id_tmp_tbl = 0 ;
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = "cari_data_ekatalog";
    obj['id'] = id;
    $.post(urlDB,obj,
      function(data,status){
        var dataAry = JSON.parse(data);

        addValueElm('no_po',dataAry['id_paket'])   
        addValueElm('id_tmp_transaksi',dataAry['id']) 

        var listAry = dataAry['detail_barang'] ;
        var htmlTable = '' ;
        for (var i=0 ; i<listAry.length ; i+=1){
          var SingleArray = listAry[i];
          addValueElm('note',SingleArray['keterangan'])
          addDataCetakInvoiceEkatalog(tag,SingleArray['id_barang'],SingleArray['harga'],SingleArray['quantity']);
        }
      } 
    );  
  }

  function addDataCetakInvoiceEkatalog(tag,id_brg,harga,qty){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = "data_barang";
    obj['tag-request'] = "permintaan";
    obj['id'] = id_brg;
    $.post(urlDB,obj,
      function(data,status){
        id_tmp_tbl++ ;
        var btn = '<a href="#" onclick="Javascript: DeleteRowTblTrx(\''+tag+'\',\'tbl_'+id_tmp_tbl+'\'); return false ;" class="label label-danger"><i class="ti-trash"></i></a>';
        var dataAry = JSON.parse(data);
        var listAry = dataAry['list'][0]
        var sHtml = ''
        if ( ListSnTrx!='undefined' &&  ListSnTrx!=null) {
          noSN = ListSnTrx ;
        } else {
          if (noSN!=''){
            noSN = noSN.replace(/(?:\r\n|\r|\n)/g, '<br>');
          }
        }

        ListSnTrx = "";
        var infoBarang = '<a href="#" onclick="Javascript: KartuStock('+listAry['id']+'); return false ;">'+listAry['nama']+'</a>';
        sHtml += '<td class="hidden">'+listAry['id']+'</td>'
        sHtml += '<td class="overlapNewLine">'+infoBarang+'</td>'
        sHtml += '<td align="right" style="width:110px;">'+number_format(harga)+'</td>'
        sHtml += '<td align="right" style="width:70px;">'+number_format(qty)+'</td>'
        sHtml += '<td class="hidden"></td>'
        sHtml += '<td class="hidden"></td>'
        sHtml += '<td align="center" style="width:60px;">'+btn+'</td>'

        $('#list_tbl').append('<tr id=tbl_'+id_tmp_tbl+'>'+sHtml+'</tr>');
        hitungInputCetakBarang(tag)
        document.getElementById('input_qty').innerHTML='' ;
        addValueElm('cari_barcode',null);
        addValueElm('id_barang',null);
        setElmFocus('cari_barcode');
        LoadingProgress(false);
      } 
    );  
  }