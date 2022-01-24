
  function InOutGudang(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/gudang/inout_view.php' ;
     
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

  function InputInOutBarang(tag){
    var id_brg = getValueElm('id_barang');
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
          sHtml += '<td align="right" style="width:70px;">'+number_format(qty)+'</td>'
          sHtml += '<td class="hidden">'+noSN+'</td>'
          sHtml += '<td class="hidden">'+ketBrg+'</td>'
          sHtml += '<td align="center" style="width:60px;">'+btn+'</td>'

          $('#list_tbl').append('<tr id=tbl_'+id_tmp_tbl+'>'+sHtml+'</tr>');
          hitungInputInOutBarang(tag)
          document.getElementById('input_qty').innerHTML='' ;
          addValueElm('cari_barcode',null);
          addValueElm('id_barang',null);
          setElmFocus('cari_barcode');
          LoadingProgress(false);

        } 
      );  
    }
  }

  function hitungInputInOutBarang(tag){
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

  function BatalInputInOutBarang(tag){
    Swal.queue([{
      title: 'Batal ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        
        if (tag=='gudang_masuk'){
          gotoJS('gudang','masuk');  
        } else if (tag=='gudang_keluar'){
          gotoJS('gudang','keluar');  
        }
      }
    }])

  }

  function SimpanInputInOutBarang(tag){
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
        var noSN = table.rows[i].cells[3].innerHTML ;
        var ketBrg = table.rows[i].cells[4].innerHTML ;


        var objElm = {};
        objElm['id'] = id ;
        objElm['qty'] = strToNumber(qty) ;
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
          if (tag=='gudang_masuk'){
            obj['suplier'] = getValueElm('suplier') ;
            obj['id_suplier'] = getValueElm('id_suplier') ;
          } else if (tag=='gudang_keluar' || tag=='gudang_keep'  || tag=='gudang_ke_keep' ){
            obj['id_pelanggan'] = getValueElm('id_pelanggan') ;
            obj['pelanggan'] = getValueElm('pelanggan') ;
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
                  if (tag=='gudang_masuk'){
                    gotoJS('gudang','masuk');  
                  } else if (tag=='gudang_keluar'){
                    gotoJS('gudang','keluar');  
                  } else if (tag=='gudang_ke_toko'){
                    gotoJS('gudang','toko');  
                  } else if (tag=='gudang_ke_expedisi'){
                    gotoJS('gudang','expedisi');  
                  } else if (tag=='gudang_ke_keep'){
                    gotoJS('gudang','keep');  
                  } else if (tag=='expedisi_ke_gudang'){
                    gotoJS('expedisi','gudang');  
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
