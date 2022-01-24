
  function EntryCetak(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/cetak/view.php' ;
     
      var no = getValueElm('no_trx') ;
      var param = "no="+no+"&trx="+tag;
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

  function InputCetakBarang(tag){
    var id_brg = getValueElm('id_barang');
    var harga = getValueElm('harga')
    var qty = getValueElm('qty')
    var ketBrg = getValueElm('keterangan_brg')
    var noSN = getValueElm('sn')


    if (qty<1){
      Swal.fire({type: 'error',title: 'Silahkan isi Quantity'})
      return ;
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

          if (ketBrg!=''){
            infoBarang += '<br/><label class="text-red">'+ketBrg+'</label>';
          }

          sHtml += '<td class="hidden">'+listAry['id']+'</td>'
          sHtml += '<td class="overlapNewLine">'+infoBarang+'</td>'
          sHtml += '<td align="right" style="width:110px;">'+number_format(harga)+'</td>'
          sHtml += '<td align="right" style="width:70px;">'+number_format(qty)+'</td>'
          sHtml += '<td class="hidden">'+noSN+'</td>'
          sHtml += '<td class="hidden">'+ketBrg+'</td>'
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
  }

  function hitungInputCetakBarang(tag){
    var jml = 0 ;
    var table = document.getElementById("list_tbl") ;
    var rowLength = table.rows.length ;
    if (rowLength>0){
      for (var i=1 ; i<rowLength ; i+=1){
        var row = table.rows[i] ;
        var id = strToNumber(table.rows[i].cells[0].innerHTML) ;
        var qty = strToNumber(table.rows[i].cells[2].innerHTML) ;
        jml += qty ;
        
      }
    }
    if (jml>0){
      document.getElementById('info_jumlah').innerHTML = "<h5>Jumlah : "+number_format(jml)+"</h5>" ;  
      $("#div_btn_action").removeClass("hidden");  
    } else {
      $("#div_btn_action").removeClass("hidden");  
    }
  }


  function BatalInputCetak(tag){
    Swal.queue([{
      title: 'Batal ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
     
        if (tag=='cetak_po' || tag=='cetak_do_po'){
          gotoJS('permintaansyn','po');    
        } else if (tag=='cetak_do_keluar'){
          gotoJS('permintaansyn','domasuk');    
        } else if (tag=='cetak_do_keluar_ekat'){
          gotoJS('ekatalog','do');
        } else if (tag=='cetak_po_ekat'){
          gotoJS('ekatalog','createpo');
        } else if (tag=='cetak_do_keluar_marketing'){
          InfoProsesMarketing('createdomarketing');
        } else {
          console.log(tag);
          gotoJS('cetak',tag);    
        }

      }
    }])

  }

  function SimpanInputCetak(tag){
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
        var harga = table.rows[i].cells[2].innerHTML ;
        var qty = table.rows[i].cells[3].innerHTML ;
        var noSN = table.rows[i].cells[4].innerHTML ;
        var ketBrg = table.rows[i].cells[5].innerHTML ;

        var objElm = {};
        objElm['id'] = id ;
        objElm['harga'] = strToNumber(harga) ;
        objElm['qty'] = strToNumber(qty) ;
        objElm['sn'] = noSN ;
        objElm['keterangan'] = ketBrg ;
        objList.push(objElm);
      }
      Swal.queue([{
        title: 'Simpan Untuk di Cetak ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = 'simpan_transaksi_cetak' ;
          obj['tag'] = tag ;
          obj['id_tmp_transaksi'] = getValueElm('id_tmp_transaksi') ;
          obj['tanggal'] = getValueElm('tanggal') ;
          obj['no_trx'] = getValueElm('no_trx') ;
          obj['note'] = getValueElm('note') ;
          obj['no_po'] = getValueElm('no_po') ;
          obj['sales'] = getValueElm('sales') ;
          
          obj['delivery_to'] = getValueElm('delivto') ;
          obj['alamat_delivto'] = getValueElm('alamat_delivto') ;
          obj['person_name_delivto'] = getValueElm('person_name_delivto') ;
          obj['person_tlp_delivto'] = getValueElm('person_tlp_delivto') ;


          obj['ship_to'] = getValueElm('shipto') ;
          obj['alamat_shipto'] = getValueElm('alamat_shipto') ;
          obj['person_name_shipto'] = getValueElm('person_name_shipto') ;
          obj['person_tlp_shipto'] = getValueElm('person_tlp_shipto') ;

          
          obj['keterangan'] = getValueElm('keterangan') ;
          obj['list'] = objList ;

          $.post(urlDB,obj,
            function(data,status){
              LoadingProgress(false);
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  if (tag=='cetak_po' || tag=='cetak_do_po'){
                    gotoJS('permintaansyn','po');    
                  } else if (tag=='cetak_do_keluar'){
                    gotoJS('permintaansyn','domasuk');    
                  } else if (tag=='cetak_do_keluar_ekat'){
                    gotoJS('ekatalog','do');
                  } else if (tag=='cetak_po_ekat'){
                    gotoJS('ekatalog','createpo');
                  } else if (tag=='cetak_do_keluar_marketing'){
                    InfoProsesMarketing('createdomarketing');
                  } else {
                    console.log(tag);
                    gotoJS('cetak',tag);    
                  }
                  
                 
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
  }



  function ViewEntryCetak(tag,nPage){
    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }

    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/cetak/cetak_view.php' ;
     
      var cari = getValueElm('cari') ;
      var param = "cari="+cari+"&tag="+tag+"&page="+page;
      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

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


  function PrintOutCetak(id,tag){
    var buttonsPlus = $('<div>')
      .append(createButton('Tanpa Header','sw_non_header','btn-warning'))
      .append(createButton('Dengan Header','sw_header','btn-primary'))
      .append(createButton('Batal','sw_batal',''));
      swal({
        html: buttonsPlus,
        showCancelButton: false,
        showConfirmButton: false,
        onOpen: function (dObj) {
          $('#sw_batal').on('click',function () {
            swal.close();
          });
          $('#sw_non_header').on('click',function () {
            PrintOutCetakShow(id,tag,0)
            swal.close();
          });
          $('#sw_header').on('click',function () {
            PrintOutCetakShow(id,tag,1)
            swal.close();
          });
          
        }
      });
  }

  function PrintOutCetakShow(id,tag,header){
    var url = 'aplikasi/cetak/cetak_pdf.php' ;
    var params = {} ;
    params.id = id
    params.tag = tag
    params.header = header
    OpenWindowWithPost(url, "", tag, params);
  }

  function PrintOutCetakPO(nocetak){
    var url = 'aplikasi/cetak/cetak_po.php' ;
    var params = {} ;
    params.no_cetak = nocetak
    params.tag = 'po'
    params.header = 1
    OpenWindowWithPost(url, "", "po"+nocetak, params);
  }
  function PrintOutCetakDOKeluar(nocetak){
    var url = 'aplikasi/cetak/cetak_do_keluar.php' ;
    var params = {} ;
    params.no_cetak = nocetak
    params.tag = 'do'
    params.header = 1
    OpenWindowWithPost(url, "", "do"+nocetak, params);
  }

