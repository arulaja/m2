
  function InfoBarang(tag,tagType,nPage){
    page = 0 ;
    if (nPage!='undefined' && nPage!=null){
      page = nPage ;
    }

    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['cari'] = getValueElm('cari') ;
    p_obj['tag'] = tag ;
    p_obj['tagType'] = tagType ;
    p_obj['page'] = page ;

    runXHR('aplikasi/informasi/barang_view.php',p_obj,InfoBarangCallback);

  }
  function InfoBarangCallback(data){
    var obj = document.getElementById('view_list');
    if (obj!='undefined' && obj!=null){
      obj.innerHTML = data;
      ReloadJsFunc();
    } else {
      PopupModalHtml(data);
    }

  }


  
  function KartuStock(id){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;

    runXHR('aplikasi/informasi/barang_history.php',p_obj,PopupModalHtml);
  }

  function KartuStockPO(id){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;

    runXHR('aplikasi/informasi/info_po_popup.php',p_obj,PopupModalHtml);
  }
  function KartuStockKeep(id){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;

    runXHR('aplikasi/informasi/info_keep_popup.php',p_obj,PopupModalHtml);
  }

  function InfoPengirimanExpedisi(id){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;
    runXHR('aplikasi/informasi/info_pengiriman_expedisi.php',p_obj,PopupModalHtml);
  }

  function InfoProject(id,tag=''){
    var p_obj = {};
    p_obj = PostUserInfo(p_obj);
    p_obj['id'] = id ;
    p_obj['tag'] = tag ;
    runXHR('aplikasi/ekatalog/info.php',p_obj,PopupModalHtml);
  }


  function InfoHistoryBayar(id){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/transaksi/pembayaran_info.php' ;
     
      var param = 'id='+id;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var htmlContent = xmlHttp.responseText;
            
            var infoModal = document.getElementById('ContentPopupModal');
            infoModal.innerHTML = htmlContent;
            
            $("#PopupModal").modal()
        };
      };
      xmlHttp.send(param);
    }

  }


  function InfoHistorySN(sn){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/informasi/sn_history.php' ;
     
      var param = 'sn='+sn;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var htmlContent = xmlHttp.responseText;
            
            var infoModal = document.getElementById('ContentPopupModal');
            infoModal.innerHTML = htmlContent;
            
            $("#PopupModal").modal()
        };
      };
      xmlHttp.send(param);
    }

  }

  function DetailBarang(id){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/informasi/barang_detail.php' ;
     
      var param = 'id='+id;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var htmlContent = xmlHttp.responseText;
            swal({
              html: htmlContent,
              showConfirmButton:true,
              showCloseButton: true,
              confirmButtonText: 'Tutup'
            })
        };
      };
      xmlHttp.send(param);
    }
  }

  function addTabKartuStockToko(id){
    $('#lihome').removeClass('active');
    $('#linote').removeClass('active');
    $('#lihometoko').addClass('active');

    $('#divhome').removeClass('active');
    $('#divtoko').addClass('active');
    $('#divnote').removeClass('active');

    var objDiv = document.getElementById('divtoko');
    if (objDiv!='undefined' && objDiv!=null){
      objDiv.innerHTML = 'Loading data...'

      var htmlData = '' ;
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'kartu_stock' ;
      obj['info_toko'] = 'INFOTOKO' ;
      
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            console.log(data);
            var dataAry = JSON.parse(data);
            var listAry = dataAry['list'] ;
            var htmlTable = '' 
            for (var i=0 ; i<listAry.length ; i+=1){
              var SingleArray = listAry[i];
              var tgl = strToDateIndoShort(SingleArray['tanggal_timestamp']);
              var infoTrx = '' 
              if (SingleArray['sts_transaksi']=='SIPLAH'){
                infoTrx = '<label class="badge bg-info">SIPLAH</label>' ;
              } else {
                if (SingleArray['sts_transaksi']=='0') infoTrx = '<label class="badge badge-danger">BELI</label>' ;
                else if (SingleArray['sts_transaksi']=='1') infoTrx = '<label class="badge badge-inverse-success">RETUR</label>' ;
                else if (SingleArray['sts_transaksi']=='2') infoTrx = '<label class="badge badge-primary">JUAL</label>' ;
                else if (SingleArray['sts_transaksi']=='3') infoTrx = '<label class="badge badge-inverse-danger">RETUR</label>' ;
                else if (SingleArray['sts_transaksi']=='4') infoTrx = '<label class="badge badge-inverse-info">PO</label>' ;
                else if (SingleArray['sts_transaksi']=='5') infoTrx = '<label class="badge badge-warning">PESANAN</label>' ;
                else if (SingleArray['sts_transaksi']=='6') infoTrx = '<label class="badge badge-danger">GD IN</label>' ;
                else if (SingleArray['sts_transaksi']=='7') infoTrx = '<label class="badge badge-primary">GD OUT</label>' ;
                else if (SingleArray['sts_transaksi']=='8') infoTrx = '<label class="badge badge-success">GD TOKO</label>' ;
                else if (SingleArray['sts_transaksi']=='9') infoTrx = '<label class="badge badge-success">GD EXP</label>' ;
                else if (SingleArray['sts_transaksi']=='10') infoTrx = '<label class="badge badge-primary">TOKO GD</label>' ;
                else if (SingleArray['sts_transaksi']=='11') infoTrx = '<label class="badge badge-primary">TOKO EXP</label>' ;
                else if (SingleArray['sts_transaksi']=='12') infoTrx = '<label class="badge badge-warning">EXP TOKO</label>' ;
                else if (SingleArray['sts_transaksi']=='13') infoTrx = '<label class="badge badge-warning">EXP GD</label>' ;
                else if (SingleArray['sts_transaksi']=='14') infoTrx = '<label class="badge badge-warning">GD KEEP</label>' ;
                else if (SingleArray['sts_transaksi']=='15') infoTrx = '<label class="badge badge-info">KEEP GD</label>' ;
                else if (SingleArray['sts_transaksi']=='16') infoTrx = '<label class="badge badge-warning">KEEP EXP</label>' ;
              }
              infoTrx = SingleArray['no_transaksi']+infoTrx;


              htmlTable += '<tr>'
                            +'<td style="width:80px;">'+tgl+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['masuk']+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['keluar']+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['stock']+'</td>'
                            +'<td align="left" class="overlapNewLine">'+infoTrx+'</td>'
                            +'<td align="left" class="overlapNewLine">'+SingleArray['keterangan']+'</td>'
                            +'<td align="left" class="overlapNewLine">'+SingleArray['user']+'</td>'
                          +'</tr>';

            }
            if (htmlTable!=''){
              htmlData = '<table class="table default table-hover" id="list_tbl">'
                            +'<thead>'
                              +'<tr>'
                                +'<td>Tanggal</td>'
                                +'<td>Masuk</td>'
                                +'<td>Keluar</td>'
                                +'<td>Sisa</td>'
                                +'<td>No Trx</td>'
                                +'<td>Keterangan</td>'
                                +'<td>User</td>'
                              +'</tr>'
                            +'</thead>'
                            +'<tbody>'+htmlTable+'</tbody>'
                          +'</table>'
              objDiv.innerHTML = htmlData ;
            } else {
              objDiv.innerHTML = '<div class="mb-2 text-red f-20">DATA TIDAK DITEMUKAN</div>' ;
            }
            
          };
        } 
      ); 
    }

  }
  function addTabKartuStock(id,judul){

    var objUl = document.getElementById('ul_kartu_stok');
    if (objUl!='undefined' && objUl!=null){
      
      var objLi = document.getElementById('li'+id);
      if (objLi=='undefined' || objLi==null){
        var html = objUl.innerHTML ; 
        if (judul=='') judul = id ;
        html += '<li class="nav-item" >'
                  +'<a class="nav-link" id="li'+id+'" data-toggle="tab" href="#div'+id+'" role="tab" aria-expanded="true">'+judul+'</a>'
                +'</li>';
        objUl.innerHTML = html ;
      }
    }
    $('#lihome').removeClass('active');
    $('#li'+id).addClass('active');
    $('#li'+id).addClass('complete');

    

    $('#divhome').removeClass('active');
    
    $('#div'+id).addClass('active');

    var objDiv = document.getElementById('div'+id);
    if (objDiv!='undefined' && objDiv!=null){
      objDiv.innerHTML = 'Loading data...'

      var htmlData = '' ;
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'kartu_stock' ;
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            var dataAry = JSON.parse(data);
            var listAry = dataAry['list'] ;
            var htmlTable = '' 
            for (var i=0 ; i<listAry.length ; i+=1){
              var SingleArray = listAry[i];
              var tgl = strToDateIndoShort(SingleArray['tanggal_timestamp']);
              var infoTrx = '' 
              if (SingleArray['sts_transaksi']=='SIPLAH'){
                infoTrx = '<label class="badge bg-info">SIPLAH</label>' ;
              } else {
                if (SingleArray['sts_transaksi']=='0') infoTrx = '<label class="badge badge-danger">BELI</label>' ;
                else if (SingleArray['sts_transaksi']=='1') infoTrx = '<label class="badge badge-inverse-success">RETUR</label>' ;
                else if (SingleArray['sts_transaksi']=='2') infoTrx = '<label class="badge badge-primary">JUAL</label>' ;
                else if (SingleArray['sts_transaksi']=='3') infoTrx = '<label class="badge badge-inverse-danger">RETUR</label>' ;
                else if (SingleArray['sts_transaksi']=='4') infoTrx = '<label class="badge badge-inverse-info">PO</label>' ;
                else if (SingleArray['sts_transaksi']=='5') infoTrx = '<label class="badge badge-warning">PESANAN</label>' ;
                else if (SingleArray['sts_transaksi']=='6') infoTrx = '<label class="badge badge-danger">GD IN</label>' ;
                else if (SingleArray['sts_transaksi']=='7') infoTrx = '<label class="badge badge-primary">GD OUT</label>' ;
                else if (SingleArray['sts_transaksi']=='8') infoTrx = '<label class="badge badge-success">GD TOKO</label>' ;
                else if (SingleArray['sts_transaksi']=='9') infoTrx = '<label class="badge badge-success">GD EXP</label>' ;
                else if (SingleArray['sts_transaksi']=='10') infoTrx = '<label class="badge badge-primary">TOKO GD</label>' ;
                else if (SingleArray['sts_transaksi']=='11') infoTrx = '<label class="badge badge-primary">TOKO EXP</label>' ;
                else if (SingleArray['sts_transaksi']=='12') infoTrx = '<label class="badge badge-warning">EXP TOKO</label>' ;
                else if (SingleArray['sts_transaksi']=='13') infoTrx = '<label class="badge badge-warning">EXP GD</label>' ;
                else if (SingleArray['sts_transaksi']=='14') infoTrx = '<label class="badge badge-warning">GD KEEP</label>' ;
                else if (SingleArray['sts_transaksi']=='15') infoTrx = '<label class="badge badge-info">KEEP GD</label>' ;
                else if (SingleArray['sts_transaksi']=='16') infoTrx = '<label class="badge badge-warning">KEEP EXP</label>' ;
              }
              infoTrx = SingleArray['no_transaksi']+infoTrx;


              htmlTable += '<tr>'
                            +'<td style="width:80px;">'+tgl+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['masuk']+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['keluar']+'</td>'
                            +'<td style="width:50px;" align="right">'+SingleArray['stock']+'</td>'
                            +'<td align="left" class="overlapNewLine">'+infoTrx+'</td>'
                            +'<td align="left" class="overlapNewLine">'+SingleArray['keterangan']+'</td>'
                            +'<td align="left" class="overlapNewLine">'+SingleArray['user']+'</td>'
                          +'</tr>';

            }
            if (htmlTable!=''){
              htmlData = '<table class="table default table-hover" id="list_tbl">'
                            +'<thead>'
                              +'<tr>'
                                +'<td>Tanggal</td>'
                                +'<td>Masuk</td>'
                                +'<td>Keluar</td>'
                                +'<td>Sisa</td>'
                                +'<td>No Trx</td>'
                                +'<td>Keterangan</td>'
                                +'<td>User</td>'
                              +'</tr>'
                            +'</thead>'
                            +'<tbody>'+htmlTable+'</tbody>'
                          +'</table>'
              objDiv.innerHTML = '<div class="mb-2 text-red f-20">'+dataAry['nama']+'</div>'+htmlData ;
            } else {
              objDiv.innerHTML = '<div class="mb-2 text-red f-20">DATA TIDAK DITEMUKAN</div>' ;
            }
            
          };
        } 
      ); 
    }

  }
  /* START TAB SN */
  function addTabListSN(id,judul){

    var objUl = document.getElementById('ul_kartu_stok');
    if (objUl!='undefined' && objUl!=null){
      var objLi = document.getElementById('li'+id);
      if (objLi=='undefined' || objLi==null){
        var html = objUl.innerHTML ; 
        if (judul=='') judul = id ;
        html += '<li class="nav-item" >'
                  +'<a class="nav-link" id="li'+id+'" data-toggle="tab" href="#div'+id+'" role="tab" aria-expanded="true">'+judul+'</a>'
                +'</li>';
        objUl.innerHTML = html ;
      }
    }


    var objDiv = document.getElementById('div_kartu_stok');
    if (objDiv!='undefined' && objDiv!=null){
      var objDivSub = document.getElementById('div'+id);
      if (objDivSub=='undefined' || objDivSub==null){
        var htmlDiv = objDiv.innerHTML ; 
        if (judul=='') judul = id ;
        htmlDiv += '<div class="tab-pane px-1 pt-4" id="div'+id+'" role="tabpanel" aria-expanded="false"></div>';
        objDiv.innerHTML = htmlDiv ;
      }
    }
    $('#lihome').removeClass('active');
    $('#li'+id).addClass('active');
    $('#li'+id).addClass('complete');

    $('#divhome').removeClass('active');
    
    $('#div'+id).addClass('active');


    var objDiv = document.getElementById('div'+id);
    if (objDiv!='undefined' && objDiv!=null){
      objDiv.innerHTML = 'Loading data...'

      var htmlData = '' ;
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'info_no_sn_transaksi' ;
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            var dataAry = JSON.parse(data);
            var listAry = dataAry['list'] ;
            var htmlTable = '' ;
            for (var i=0 ; i<listAry.length ; i+=1){
              var SingleArray = listAry[i];
              
              htmlTable += '<tr>'
                            +'<td class="overlapNewLine">'+SingleArray['no_transaksi']+'</td>'
                            +'<td class="overlapNewLine">'+SingleArray['sn']+'</td>'
                            +'<td class="overlapNewLine">'+SingleArray['produksi']+'</td>'
                            +'<td class="overlapNewLine">'+SingleArray['exp_start']+'</td>'
                            +'<td class="overlapNewLine">'+SingleArray['exp_end']+'</td>'
                          +'</tr>';

            }
            if (htmlTable!=''){
              htmlData = '<table class="table default table-hover" id="list_tbl">'
                            +'<thead>'
                              +'<tr>'
                                +'<td>No Trx</td>'
                                +'<td>SN</td>'
                                +'<td>Produksi</td>'
                                +'<td>Start</td>'
                                +'<td>END</td>'
                              +'</tr>'
                            +'</thead>'
                            +'<tbody>'+htmlTable+'</tbody>'
                          +'</table>'
              objDiv.innerHTML = htmlData ;
            } else {
              objDiv.innerHTML = '<div class="mb-2 text-red f-20">DATA TIDAK DITEMUKAN</div>' ;
            }
            
          };
        } 
      ); 
    }
  }

  /*BATAS TAB SN */

  var pageProdukSn = 0 ;
  function NextPageProdukSn(id){
    pageProdukSn++ ;
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'list_sn_ready' ;
    obj['id'] = id ;
    obj['page'] = pageProdukSn ;
          
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          var obj = document.getElementById('list_tbl_sn');
          if (obj!='undefined' && obj!=null){
            var table = document.getElementById("list_tbl_sn");

            var dataAry = JSON.parse(data);
            var listAry = dataAry['sn'] ;
            var htmlTable = '' 
            for (var i=0 ; i<listAry.length ; i+=1){
              var SingleArray = listAry[i];

              var row = table.insertRow(-1);

              var cell1 = row.insertCell(0);
              var cell2 = row.insertCell(1);
              var cell3 = row.insertCell(2);
              var cell4 = row.insertCell(3);
              var cell5 = row.insertCell(4);
              var cell6 = row.insertCell(5);

              // Add some text to the new cells:
              cell1.innerHTML = strToDateIndoShort(SingleArray['tgl_trx']);
              cell2.innerHTML = SingleArray['no_transaksi'];
              cell3.innerHTML = SingleArray['sn'];
              cell4.innerHTML = SingleArray['produksi'];
              cell5.innerHTML = strToDateIndoShort(SingleArray['start_date']);
              cell6.innerHTML = strToDateIndoShort(SingleArray['end_date']);
            }

          }

        };
      } 
    ); 
  }



  function SimpanCatatanBarang(id){
    var obj = {};
    obj = PostUserInfo(obj);
    obj['kirim'] = 'simpan_catatan_barang' ;
    obj['id'] = id ;
    obj['catatan'] = getValueElm('input_komentar') ;
          
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          var dataAry = JSON.parse(data);

          var obj = document.getElementById('isi_komentar');
          if (obj!='undefined' && obj!=null){
            var html = '' ; 
            html += '<blockquote >'
                      +'<div class="d-flex">'
                        +'<i class="icofont icofont-hand-right text-info"></i>'
                        +'<p class="m-b-0 ml-2">'+dataAry['komentar']+'</p>'
                      +'</div>'
                      +'<footer class="blockquote-footer ml-4">'+dataAry['nama_user']
                        +' <small class="text-muted">( '+strToDateIndoShort(dataAry['tanggal_timestamp'])+' )</small>'
                      +'</footer>'
                    +'</blockquote>'
            obj.innerHTML = html+ obj.innerHTML;
            addValueElm('input_komentar',null)
          }
        };
      } 
    ); 
  }

