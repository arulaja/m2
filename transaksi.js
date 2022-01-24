
  function ProsesTrx(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/transaksi/trx_view.php' ;
     
      var no = getValueElm('no_trx') ;
      var param = "no="+no+"&trx="+tag;
      if (tag=='siplah'){
        url = 'aplikasi/siplah/input_view.php' ;
      } else if (tag=='rubah'){
        url = 'aplikasi/transaksi/rubah_view.php' ;
      }

      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          LoadingProgress(false);
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
            if (tag=='siplah'){
              ReloadElmSiplah()
            } else {
              setElmFocus('cari_barcode');
            }
          }          
          ReloadJsFunc()
        };
      };

      xmlHttp.send(param);
    }
  }

  var id_tmp_tbl = 0 ;
  function TambahTrxBrg(tag){
    var id_brg = getValueElm('id_barang');
    var qty = getValueElm('qty')
    var beli = getValueElm('beli')
    var jual = getValueElm('jual')
    var noSN = getValueElm('sn')
    var ketBrg = getValueElm('keterangan_brg')

    var harga = 0

    if (tag=='jual' || tag=='pesan'){
      beli = parseInt(beli)
      harga = parseInt(jual) ;
      if (harga<beli){
        Swal.fire({type: 'error',title: 'Tidak boleh lebih rendah dari harga beli'})
        return ;
      }
    } else if (tag=='beli' || tag=='po'){
      harga = beli ;
    }

    if (qty<1){
      Swal.fire({type: 'error',title: 'Silahkan isi Quantity'})
      return ;
    }
    if (tag!='returjual' && tag!='returbeli' && tag!='rubah'){
      if (harga<1){
        Swal.fire({type: 'error',title: 'Silahkan isi Harga'})
        return ;
      }
    }
    
    if (id_brg>0 && qty>0){
      LoadingProgress(true);
      var obj = {};
      obj = PostUserInfo(obj);
      obj['kirim'] = "data_barang";
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
          sHtml += '<td align="right">'+number_format(qty)+'</td>'
          if (tag=='jual' || tag=='pesan' || tag=='po'){
            sHtml += '<td align="right">'+number_format(harga)+'</td>'
          } else if (tag=='beli'){
            sHtml += '<td align="right">'+number_format(beli)+'</td>'
            sHtml += '<td align="right">'+number_format(jual)+'</td>'
          }
          sHtml += '<td class="hidden">'+noSN+'</td>'
          sHtml += '<td class="hidden">'+ketBrg+'</td>'
          sHtml += '<td align="center">'+btn+'</td>'

          $('#list_tbl').append('<tr id=tbl_'+id_tmp_tbl+'>'+sHtml+'</tr>');
          hitungJumlah(tag);
          document.getElementById('input_qty').innerHTML='' ;
          addValueElm('cari_barcode',null);
          addValueElm('id_barang',null);
          setElmFocus('cari_barcode');
          LoadingProgress(false);

        } 
      );  
    }
  }
  function hitungJumlah(tag){
    var jml = 0 ;
    var table = document.getElementById("list_tbl") ;
    var rowLength = table.rows.length ;
    if (rowLength>0){
      for (var i=1 ; i<rowLength ; i+=1){
        var row = table.rows[i] ;
        var id = strToNumber(table.rows[i].cells[0].innerHTML) ;
        var qty = strToNumber(table.rows[i].cells[2].innerHTML) ;
        
        if (tag=='jual' || tag=='pesan' || tag=='po') {
          var harga = strToNumber(table.rows[i].cells[3].innerHTML) ;
          var sub = harga*qty ;
          jml += sub ;     
        } else if (tag=='beli'){
          var beli = strToNumber(table.rows[i].cells[3].innerHTML) ;
          var jual = strToNumber(table.rows[i].cells[4].innerHTML) ;
          var sub = beli*qty ;
          jml += sub ;   
        }

        
      }
    }
    if (jml>0){
      document.getElementById('info_jumlah').innerHTML = "<h5>Jumlah : "+number_format(jml)+"</h5>" ;  
      $("#div_btn_action").removeClass("hidden");  
    } else {
      if (tag=='po' || tag=='pesan' || tag=='returjual' || tag=='returbeli') {
        $("#div_btn_action").removeClass("hidden");  
      }   else {
        $("#div_btn_action").addClass('hidden')
      }
    }
  }




  function BatalTrx(tag){
    Swal.queue([{
      title: 'Batal ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        
        if (tag=='beli'){
          gotoJS('input','beli');  
        } else if (tag=='jual'){
          gotoJS('input','jual');  
        } else if (tag=='po'){
          gotoJS('input','po');  
        } else if (tag=='pesan'){
          gotoJS('input','pesanan');  
        }
      }
    }])

  }


  function DeleteRowTblTrx(tag,id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        $('#'+id).remove();
        hitungJumlah(tag)
      }
    }])
  }



  function HapusTrx(tag){
    Swal.queue([{
      title: 'Hapus Transaksi ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        LoadingProgress(true);
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = 'hapus_transaksi' ;
        obj['no_trx'] = getValueElm('no_trx') ;
        $.post(urlDB,obj,
          function(data,status){
            LoadingProgress(false);
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                gotoJS('input','rubah');  
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
  function SimpanTrx(tag){
    var no =getValueElm('no_trx') ;
    if (no==''){
      Swal.fire({type: 'error',title: 'Nomor Tidak Boleh Kosong'})
      return ;
    }
    var table = document.getElementById("list_tbl") ;
    var rowLength = table.rows.length ;
    if (rowLength>0){
      var objList = [];
      for (var i=1 ; i<rowLength ; i+=1){
        var row = table.rows[i] ;
        var id = table.rows[i].cells[0].innerHTML ;
        var qty = table.rows[i].cells[2].innerHTML ;


        var objElm = {};
        objElm['id'] = id ;
        objElm['qty'] = strToNumber(qty) ;
        
        var noSN = '' ;
        var ketBrg = '' ;
        if (tag=='beli'){
          var beli = table.rows[i].cells[3].innerHTML ;
          var jual = table.rows[i].cells[4].innerHTML ;
          noSN = table.rows[i].cells[5].innerHTML ;
          ketBrg = table.rows[i].cells[6].innerHTML ;
          
          objElm['beli'] = strToNumber(beli) ;
          objElm['jual'] = strToNumber(jual) ;
          
        } else if (tag=='jual' || tag=='pesan' || tag=='po'){
          var harga = table.rows[i].cells[3].innerHTML ;
          noSN = table.rows[i].cells[4].innerHTML ;
          ketBrg = table.rows[i].cells[5].innerHTML ;
          objElm['harga'] = strToNumber(harga) ;
        }
        objElm['sn'] = noSN ;
        objElm['keterangan'] = ketBrg ;
        objList.push(objElm);
      }
      Swal.queue([{
        title: 'Simpan Transaksi ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = 'simpan_transaksi' ;
          obj['tag'] = tag ;
          obj['tanggal'] = getValueElm('tanggal') ;
          if (tag=='beli' || tag=='po' || tag=='returbeli'){
            obj['suplier'] = getValueElm('suplier') ;
            obj['id_suplier'] = getValueElm('id_suplier') ;
          } else if (tag=='jual' || tag=='pesan' || tag=='returjual'){
            obj['id_pelanggan'] = getValueElm('id_pelanggan') ;
            obj['pelanggan'] = getValueElm('pelanggan') ;
          }

          if (tag=='beli' || tag=='po' || tag=='jual' || tag=='pesan'){
            obj['sts_bayar'] = getSelectValueElm('sts_bayar') ;
            obj['tgl_tempo'] = getValueElm('jatuh_tempo') ;
          }

          obj['no_trx'] = getValueElm('no_trx') ;
          obj['keterangan'] = getValueElm('keterangan') ;
          obj['list'] = objList ;

          $.post(urlDB,obj,
            function(data,status){
              LoadingProgress(false);
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  if (tag=='beli'){
                    gotoJS('input','beli');  
                  } else if (tag=='jual'){
                    gotoJS('input','jual');  
                  } else if (tag=='po'){
                    gotoJS('input','po');  
                  } else if (tag=='pesan'){
                    gotoJS('input','pesanan');  
                  } else if (tag=='returbeli'){
                    gotoJS('input','returbeli');  
                  } else if (tag=='returjual'){
                    gotoJS('input','returjual');  
                  }
                } else {
                  Swal.fire({type: 'error',title: data})
                  console.log("error : "+data)
                }
              } else {
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          );  
        }
      }])
    }
  }

  function ProsesTrxPO(mnu,tag ,id){
    var tanya = 'Selesai ? ' ;
    if (tag=='batal'){
      tanya = 'Batal ? ' ;
    }
    Swal.queue([{
      title: tanya,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['id'] = id ;
        obj['trx'] = mnu ;
        obj['tag'] = tag ;
        obj['kirim'] = 'transaksi_po' ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                document.getElementById('view_list_detail').innerHTML='';
                LaporanTrx(mnu);
                document.getElementById("view_list").scrollIntoView();

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

  function ProsesDetail(tag,idtrx,id){
    var judulTanya = 'Barang Sudah diterima ??' ;
    if (tag=='returjual'){
      judulTanya = 'Barang Sudah Dikirim ??'
    }

    Swal.queue([{
      title: judulTanya,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['idtrx'] = idtrx ;
        obj['id'] = id ;
        obj['tag'] = tag ;
        obj['kirim'] = 'proses_detail_transaksi' ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                DetailTrx(tag,idtrx);
              } else {
                console.log(data)
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


  function FormInputNoteBarang(tag,idTrx,id){
    Swal.mixin({
      input: 'textarea',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1']
    }).queue([
      'Catatan'
    ]).then((result) => {
      if (result.value) {
        var note = result.value[0] ;
        UpdateInputNoteBarang(tag,idTrx,id,note);
      }
    })
  }

  function UpdateStatusPO(tag,idTrx){
    var htmlInput = '<input type="text" id="tanggal_sw" name="tanggal_sw" class="swal2-input">'
                      +'<select class="swal2-input" id="sts_bayar_sw">'
                          +'<option value="TEMPO">TEMPO</option>'
                          +'<option value="CASH">CASH</option>'
                          +'<option value="GIRO">GIRO</option>'
                          +'<option value="LAIN LAIN">LAIN LAIN</option>'
                      +'</select>'
                + '<textarea type="text" class="swal2-input py-3" rows="8" id="catatan" placeholder="Keterangan"></textarea>';
    swal({
      title: 'Rubah Status PO',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      onOpen: function() {

        $('input[name="tanggal_sw"]').daterangepicker({
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
          $('input[name="tanggal_sw"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
          });
        });

      },
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'update_status_transaksi' ;
          objPost['id'] = idTrx ;
          objPost['tag'] = 'po' ;
          objPost['sts_bayar'] = getSelectValueElm('sts_bayar_sw') ;
          objPost['tanggal'] = getValueElm("tanggal_sw")
          objPost['catatan'] = getValueElm("catatan")

          Swal.fire({
            title: 'Simpan Perubahan Status PO ?',
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
                  LaporanTrx(tag) 
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

  function UpdateInputNoteBarang(tag,idTrx,id,note){
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
          obj['id'] = id ;
          obj['catatan'] = note ;
          obj['kirim'] = 'update_note_trx_barang' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  DetailTrx(tag,idTrx);
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


  function FormInputQtyPO(tag,Notrx,idbarang){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['I','Q', 'K']
    }).queue([
      'Nomor Invoice','Quantity','Keterangan'
    ]).then((result) => {
      if (result.value) {
        var inv = result.value[0] ;
        var qty = result.value[1] ;
        var ket = result.value[2] ;
        if (qty!=''){
          UpdateInputQtyPO(tag,Notrx,idbarang,inv,qty,ket) ;  
        }
        
      }
    })
  }

  function UpdateInputQtyPO(tag,Notrx,idbarang,inv,qty,ket){
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
          obj['no_trx'] = Notrx ;
          obj['id_barang'] = idbarang ;
          obj['invoice'] = inv ;
          obj['qty'] = qty ;
          obj['keterangan'] = ket ;
          obj['kirim'] = 'update_qty_po' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  DetailTrx(tag,Notrx);
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



  function VHutangPiutang(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      document.getElementById("view_list_detail").innerHTML="";

      var url = 'aplikasi/transaksi/pembayaran_view.php' ;
     
      var tanggal = getValueElm('tanggal') ;
      var no = getValueElm('no_trx') ;
      var id_pelanggan = getValueElm('id_pelanggan') ;
      var id_suplier = getValueElm('id_suplier') ;
      var keterangan = getValueElm('keterangan') ;

      var pelanggan = getValueElm('pelanggan') ;
      if (pelanggan=='') {
        id_pelanggan = 0 ;
      }
      var suplier = getValueElm('suplier') ;
      if (suplier=='') {
        id_suplier = 0 ;
      }


      if (tag=='hutang_piutang'){
        var tag = getSelectValueElm('sts_bayar') ;
      }

      var param = 'trx='+tag+'&no='+no+'&tanggal='+tanggal+'&pelanggan='+id_pelanggan+'&suplier='+id_suplier+'&keterangan='+keterangan;

      
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

  function FormInputBayar(tag,id){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([
      'Rp Pembayaran','Keterangan'
    ]).then((result) => {
      if (result.value) {
        var rp = result.value[0] ;
        var ket = result.value[1] ;
        if (rp!=''){
          UpdateInputBayar(tag,id,rp,ket) ;  
        }
        
      }
    })
  }

  function FormInputPajak(tag,id){
    var htmlInput = '<input type="text" id="faktur" class="swal2-input" placeholder="No Faktur Pajak">'
                    +'<input type="text" id="tanggal_file" name="tanggal" class="swal2-input" placeholder="Tanggal">'
                    + 'Foto Faktur Pajak<input type="file" id="fotofaktur" onchange="handleFiles(this.files)" >';
    swal({
      title: 'Input Data Pajak',
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

        function handleFiles(files) {
          StoreBase64Array = new Array();
          files = [...files]
          files.forEach(previewFile)
        }


      },

      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'simpan_transaksi_file' ;
          objPost['id'] = id
          objPost['tanggal'] = getValueElm("tanggal_file")
          objPost['faktur'] = getValueElm("faktur")
          objPost['file_faktur'] = StoreBase64Array ;
          

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
                StoreBase64Array = new Array();
                if (resData==1 || resData=='1' || resData) {
                  //SwalPopupSuccess('Berhasil disimpan '+resData)   ;
                  Swal.fire({type: 'error',title: 'OKOKO ('+resData+')'})
                  //LoadingProgress(false)
                  VHutangPiutang('hutang_piutang');
                } else {
                  Swal.fire({type: 'error',title: 'Gagal Proses ('+resData+')'})
                }
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
      console.log(data);
    });


  }

  function UpdateInputBayar(tag,id,rp,ket){
     Swal.queue([{
        title: 'Simpan Pembayaran ??',
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
          obj['rp'] = rp ;
          obj['ket'] = ket ;
          obj['kirim'] = 'update_bayar_hutang_piutang' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  VHutangPiutang('hutang_piutang');
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


  var readerSnTrx = null; 
  var ListSnTrx = '';

  function checkFileSNTrx() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      readerSnTrx = new FileReader();
      return true; 
    } else {
      alert('The File APIs are not fully supported by your browser. Fallback required.');
      return false;
    }
  }


  function readTextSnTrx(filePath,ObjShow) {
    if (readerSnTrx==null){
      checkFileSNTrx();
    }
    var output = ""; //placeholder for text output
    if(filePath.files && filePath.files[0]) {           
      var no=1 ;
      readerSnTrx.onload = function (e) {
        output = e.target.result;
        displayContentsSNTrx(output,ObjShow);
        no++;
      };
      readerSnTrx.readAsText(filePath.files[0]);
    } else if(ActiveXObject && filePath) {
      try {

        readerSnTrx = new ActiveXObject("Scripting.FileSystemObject");
        var file = readerSnTrx.OpenTextFile(filePath, 1); //ActiveX File Object
        output = file.ReadAll(); //text contents of file
        file.Close(); //close file "input stream"
        displayContentsSNTrx(output,ObjShow);
      } catch (e) {
        if (e.number == -2146827859) {
          alert('Unable to access local files due to browser security settings. ' + 
                'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
        }
      }       
    } else { //this is where you could fallback to Java Applet, Flash or similar
      return false;
    }       
    return true;
  }  


  function displayContentsSNTrx(txt,ObjShow) {
    ListSnTrx = "" ;
    var dataShow = "" ;
    var ks = txt.split(/\r?\n/);
    var no = 1 ; 
    for (const val of ks) {

      ListSnTrx += val+"<br/>" ;

      var dtl = val.split("|");
      dataShow += dtl[0];

      if ( dtl[1]!='undefined' &&  dtl[1]!=null) dataShow += " : " + dtl[1];
      if ( dtl[2]!='undefined' &&  dtl[2]!=null) dataShow += " : Exp  " + dtl[2];
      if ( dtl[3]!='undefined' &&  dtl[3]!=null) dataShow += " >  " + dtl[3];

      dataShow += "\n";
      no++ ;
    }

    var ObjShowSn = document.getElementById(ObjShow);
    if (ObjShowSn!='undefined' && ObjShowSn!=null){
        ObjShowSn.innerHTML  = dataShow;
      }

  }   



  function TrxUploadSn(id,qty,infoTag,infoId){
    ListSnTrx = "" ;
    fileListDO = new Array();
    var htmlInput = '<div class="form-group has-feedback">'
                  +'<div class="row mt-3">'                  
                    +'<div class="col-md-12"><textarea type="text" class="form-control" rows="3" id="view_sn" disabled="true" ></textarea></div>'
                    +'<div class="col-md-12 mt-2"><label for="file" class="badge badge-danger btn btn-danger btn-block p-2">Pilih File SN</label><input style="display:none;" type=\'file\' id="file" accept="text/plain" onchange="readTextSnTrx(this,\'view_sn\')" /></div>'
                  +'</div>';
    swal({
      title: 'Serial Number',
      html: htmlInput,
      confirmButtonText: 'Confirm',
      showCancelButton: true,
      preConfirm: function() {
        return new Promise((resolve, reject) => {
          var objPost = {};
          objPost = PostUserInfo(objPost);
          objPost['kirim'] = 'upload_no_sn_transaksi' ;
          objPost['id'] = id ; 
          objPost['tag'] = infoTag ; 
          objPost['qty'] = qty ;
          objPost['sn'] = ListSnTrx ;
          ListSnTrx = "";

          Swal.fire({
            title: 'Upload Data SN ?',
            type: 'warning',
            showCancelButton: true,
          }).then((result) => {
            if (result.value) {

              LoadingProgress(true);
              axios.post(urlDB, objPost )
              .then(function (res) {
                var resData = res.data ;
                DetailTrx(infoTag,infoId);
                Swal.fire({type: 'info',title: resData})

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

  
