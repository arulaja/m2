    function DetailPermintaanPopup(id,tag,nPage){
        page = 0 ;
        if (nPage!='undefined' && nPage!=null){
          page = nPage ;
        }
        var p_obj = {};
        p_obj = PostUserInfo(p_obj);
        p_obj['id'] = id ;
        p_obj['tag'] = tag ;
        p_obj['page'] = page ;
        runXHR('aplikasi/permintaan_server/detail.php',p_obj,PopupModalHtml);
    }

    function ListPermintaan(dataTag,nPage){
        page = 0 ;
        if (nPage!='undefined' && nPage!=null){
          page = nPage ;
        }

        var p_obj = {};
        p_obj = PostUserInfo(p_obj);
        p_obj['tag'] = dataTag ;
        p_obj['page'] = page ;
        runXHR('aplikasi/permintaan_server/index.php',p_obj,ListPermintaanCallback);
    }

    function ProsesPermintaanSyn(id,dataTag){
        var objPost = {};
        objPost = PostUserInfo(objPost);
        objPost['kirim'] = 'proses_selesai_permintaan' ;
        objPost['id'] = id;

        SubmitData('Selesai Proses ??',JSON.stringify(objPost),ProsesPermintaanCallback,dataTag);    
    }
    function ProsesPermintaanCallback(data,tag){
        var p_obj = {};
        p_obj = PostUserInfo(p_obj);
        p_obj['tag'] = tag ;
        runXHR('aplikasi/permintaan_server/index.php',p_obj,ListPermintaanCallback,tag);
    }
    


    function CetakPermintaan(id,tag){
        var p_obj = {};
        p_obj = PostUserInfo(p_obj);
        p_obj['tag'] = tag ;
        runXHR('aplikasi/cetak/index.php',p_obj,ListPermintaanCallback,tag,id);
    }

    function ListPermintaanCallback(data,tag,id){
        var obj = document.getElementById('main-content');
        if (obj!='undefined' && obj!=null){
            obj.innerHTML = data;
            ReloadJsFunc();
            if (tag!='undefined' && tag!=null){
                if (tag=="cetak_do_keluar" || tag=="cetak_do_po" || tag=="cetak_po"){
                    addDataCetakQry(tag,id);
                }
            }
        } else {
          PopupModalHtml(data);
        }
    }
    function addDataCetakQry(tag,id){
        EntryCetak(tag);
        id_tmp_tbl = 0 ;
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "list_syn_server";
        obj['tag'] = "detail";
        obj['id'] = id;
        $.post(urlDB,obj,
            function(data,status){
                var dataAry = JSON.parse(data);
                var listAry = dataAry['list'] ;
                var htmlTable = '' ;
                for (var i=0 ; i<listAry.length ; i+=1){
                    var SingleArray = listAry[i];
                    if (tag=='po' || tag=='cetak_po'){
                        addValueElm('no_po',SingleArray['no_transaksi'])    
                    }
                    
                    addValueElm('note',SingleArray['keterangan'])
                    addValueElm('id_tmp_transaksi',SingleArray['id'])
                    var detailAry = SingleArray['detail-barang'] ;
                    for (var ii=0 ; ii<detailAry.length ; ii+=1){
                        var SingleDetailArray = detailAry[i];
                        addDataCetak(tag,SingleDetailArray['id_barang'],SingleDetailArray['harga'],SingleDetailArray['quantity']);
                    }
                }
            } 
        );  
    }
    function addDataCetak(tag,id_brg,harga,qty){
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