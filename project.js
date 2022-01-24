
  var id_inp_po = 0 ;
  function CariProjectPO(tag){
    if (xmlHttp) {
      LoadingProgress(true);
      var url = 'aplikasi/project/po_input.php' ;
     
      var no = getValueElm('no_trx') ;
      var param = "no="+no;
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

  function AddProjectPo(){
    id_inp_po++ ;
    var nm = getValueElm('i_nama') ;
    var spec = getValueElm('i_spec') ;
    var qty = getValueElm('i_qty') ;
    var harga = getValueElm('i_harga') ;
    var pajak = getValueElm('i_pajak') ;

    nm = nm.replace(/\n/g, '<br>\n');

    var HapusItem = '<a href="#" onclick="javascript: DelProjectPo(\'po\',\'tbl_'+id_inp_po+'\');return false ;" type="button" class="btn btn-danger waves-effect text-center">-</a>';

    var sHtml = '<td  class="col-lg-3 overlapNewLine">'+nm+'</td>'
    sHtml += '<td class="col-lg-4">'+spec+'</td>'
    sHtml += '<td class="col-lg-1" align="right">'+number_format(qty)+'</td>'
    sHtml += '<td class="col-lg-1" align="right">'+number_format(harga)+'</td>'
    sHtml += '<td class="col-lg-1" align="right">'+number_format(pajak)+'</td>'
    sHtml += '<td class="col-lg-1" align="right"><b>'+number_format(((harga * qty) - pajak))+'</b></td>'
    sHtml += '<td class="col-lg-1" align="center">'+HapusItem+'</td>'
    //$('#list_tbl').append('<tr id=tbl_'+id_inp_po+'>'+sHtml+'</tr>');
    $('#list_tbl').prepend('<tr id=tbl_'+id_inp_po+'>'+sHtml+'</tr>');
    HitungProjectPo('');
          

  }

  function DelProjectPo(tag,id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        $('#'+id).remove();
        HitungProjectPo(tag)
      }
    }])
  }

  function HitungProjectPo(tag){
    var jml = 0 ;
    var table = document.getElementById("list_tbl") ;
    var rowLength = table.rows.length ;
    if (rowLength>0){
      for (var i=1 ; i<(rowLength) ; i+=1){
        var row = table.rows[i] ;
        var qty = strToNumber(table.rows[i].cells[2].innerHTML) ;
        var harga = strToNumber(table.rows[i].cells[3].innerHTML) ;
        var pajak = strToNumber(table.rows[i].cells[4].innerHTML) ;
        jml += ((harga * qty) - pajak)
      }
    }
    if (jml>0){
      $("#btn_simpan").removeClass("hidden");  
    } else {
      $("#btn_simpan").addClass('hidden')
    }
    
    document.getElementById('info_jumlah').innerHTML = "<h5>Jumlah : "+number_format(jml)+"</h5>" ;  
    return jml ;
  }

  function SimpanProjectPO(){
    var cekJumlah = HitungProjectPo('');
    if (cekJumlah>0){
      var objList = {};

      var table = document.getElementById("list_tbl") ;
      var rowLength = table.rows.length ;
      if (rowLength>0){
        for (var i=1 ; i<(rowLength) ; i+=1){
          var row = table.rows[i] ;
          var nama = table.rows[i].cells[0].innerHTML ;
          var spec = table.rows[i].cells[1].innerHTML ;
          var qty = strToNumber(table.rows[i].cells[2].innerHTML) ;
          var harga = strToNumber(table.rows[i].cells[3].innerHTML) ;
          var pajak = strToNumber(table.rows[i].cells[4].innerHTML) ;

          var TmptObj = {};
          TmptObj['nama'] = nama ;
          TmptObj['spec'] = spec ;
          TmptObj['qty'] = qty ;
          TmptObj['harga'] = harga ;
          TmptObj['pajak'] = pajak ;

          objList.push(TmptObj);
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
            obj['kirim'] = 'simpan_project_po' ;
            obj['tanggal'] = getValueElm('tanggal') ;
            obj['no_trx'] = getValueElm('no_trx') ;
            obj['keterangan'] = getValueElm('keterangan') ;
            obj['nama'] = getValueElm('nama') ;
            obj['alamat'] = getValueElm('alamat') ;
            obj['kota'] = getValueElm('kota') ;
            obj['provinsi'] = getValueElm('provinsi') ;
            obj['kontak'] = getValueElm('kontak') ;
            obj['person'] = getValueElm('person') ;
            obj['list'] = objList ;

            $.post(urlDB,obj,
              function(data,status){
                LoadingProgress(false);
                if (status=="success"){
                  if (data=='1' || data=='ok'){
                    SwalPopupSuccess('Berhasil disimpan')   ;
                    gotoJS('project','po');  
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
  }
