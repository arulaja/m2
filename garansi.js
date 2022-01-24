
  function InfoGaransi(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      TambahDataGaransi('batal',0)
      var url = 'aplikasi/informasi/garansi_view.php' ;

      if (tag!='undefined' && tag!=null){
        if (tag=='master'){
          url = 'aplikasi/master/garansi_view.php' ;
        }
      }
      
      var cari = getValueElm('cari') ;
      var param = 'cari='+cari;

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


  function TambahDataGaransi(tag,id){
    if (tag=='batal'){
      addValueElm('id_barang',null);
      $("#view_list").removeClass("col-md-8");
      $("#view_list").addClass('col-md-12')
      $("#view_edit").addClass('hidden')

    } else if (tag=='tambah'){
      addValueElm('id_barang',null);
      $("#view_list").removeClass("col-md-12");
      $("#view_list").addClass('col-md-8')
      $("#view_edit").removeClass('hidden')
      addValueElm('sn',null);
      addValueElm('tanggal',null);
      addValueElm('tanggal0',null);

      addValueElm('nama',null);
      addValueElm('desc',null);
      addValueElm('spec',null);
      addValueElm('merk',null);
      addValueElm('catatan',null);
      addValueElm('kategori',null);
    } else if (tag=='simpan'){
      
      Swal.queue([{
        title: 'Simpan Data SN ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          LoadingProgress(true);
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = 'simpan_data_garansi' ;
          obj['id'] = getValueElm('id_barang_sn') ;
          obj['sn'] = getValueElm('sn') ;
          obj['sn_txt'] = isifileTxt ;
          obj['start'] = getValueElm('tanggal') ;
          obj['end'] = getValueElm('tanggal0') ;
          obj['catatan'] = getValueElm('catatan') ;
          /*
          obj['nama'] = getValueElm('nama') ;
          obj['spec'] = getValueElm('spec') ;
          obj['merk'] = getValueElm('merk') ;
          obj['kategori'] = getSelectValueElm('kategori') ;
          */

          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                Swal.fire({type: 'success',title: data})
                $("#view_list").removeClass("col-md-8");
                $("#view_list").addClass('col-md-12')
                $("#view_edit").addClass('hidden')
                isifileTxt = '';
                InfoGaransi('master')

              } else {
                LoadingProgress(false);
                Swal.fire({type: 'error',title: 'Gagal Proses'})
              };
            } 
          ); 
        }
      }])
    } else if (tag=='hapus'){
      addValueElm('id_barang',null);

      Swal.queue([{
        title: 'Hapus SN ??',
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
          obj['kirim'] = 'hapus_data_garansi' ;
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                LoadingProgress(false);
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  InfoGaransi('master')
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
      var obj = {};
      obj = PostUserInfo(obj);
      obj['id'] = id ;
      obj['kirim'] = 'detail_garansi' ;

      $.post(urlDB,obj,
        function(data,status){
          LoadingProgress(false);
          if (status=="success"){
            $("#view_list").removeClass("col-md-12");
            $("#view_list").addClass('col-md-8')
            $("#view_edit").removeClass('hidden')
            //console.log(data)
            var dataAry = JSON.parse(data);

            var detailAry = dataAry['detail'][0]

            addValueElm('id_barang',detailAry['id']);

            addValueElm('sn',detailAry['sn']);
            addValueElm('tanggal',detailAry['start_date']);
            addValueElm('tanggal0',detailAry['end_date']);

            addValueElm('nama',detailAry['nama']);
            addValueElm('spec',detailAry['spesifikasi']);
            addValueElm('merk',detailAry['merk']);
            addValueElm('kategori',detailAry['id_kategori']);
            addValueElm('catatan',detailAry['catatan']);

          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'})
          };
        } 
      ); 

      
    }

  }

  
  var reader = null; 
  var isifileTxt = '';

  function checkFileAPISN() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      reader = new FileReader();
      return true; 
    } else {
      alert('The File APIs are not fully supported by your browser. Fallback required.');
      return false;
    }
  }

  function readTextSN(filePath) {
    if (reader==null){
      checkFileAPISN();
    }
    var output = ""; //placeholder for text output
    if(filePath.files && filePath.files[0]) {           
      reader.onload = function (e) {
        output = e.target.result;
        displayContentsSN(output);
      };
      reader.readAsText(filePath.files[0]);
    } else if(ActiveXObject && filePath) {
      try {
        reader = new ActiveXObject("Scripting.FileSystemObject");
        var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
        output = file.ReadAll(); //text contents of file
        file.Close(); //close file "input stream"
        displayContentsSN(output);
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

  function displayContentsSN(txt) {
    isifileTxt = txt ;
    //alert(isifileTxt)

  }   
