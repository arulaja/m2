  function CariInputKaryawan(tag){
    xmlHttp=GetXmlHttpObject();
    if (xmlHttp) {
      var url = 'aplikasi/kepegawaian/karyawan_view.php' ;
      
      var pin = getValueElm('cari_pin') ;
      var nip = getValueElm('cari_nip') ;
      var nama = getValueElm('cari_nama') ;
      var param = "pin="+pin+"&nip="+nip+"&nama="+nama;

      if (tag!='undefined' && tag!=null){
        param += '&baru=1';
      }
      var obj = document.getElementById('view_list');
      obj.innerHTML =  '<div class="w-100 text-center"><img src="assets/images/loading.gif" style="height: 100px"> </div>' ;

      xmlHttp.open("POST", url , true);
      xmlHttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          //var obj = document.getElementById('view_list');
          if (obj!='undefined' && obj!=null){
            obj.innerHTML = xmlHttp.responseText;
          }          
          ReloadJsFunc()

        };
      };

      xmlHttp.send(param);
    }
  }


  function FormInputKaryawan(sts=1){
    if (sts==1){
      $("#form_input").removeClass("hidden");  
      addValueElm('id',0)
      addValueElm('nip','')
      addValueElm('pin','')
      addValueElm('nama','')
      addValueElm('alamat','')
      addValueElm('kota','')
      addValueElm('kelamin',null)
      addValueElm('tlp','')
      addValueElm('email','')
      addValueElm('suami_istri','')
      addValueElm('anak','')
      addValueElm('bpjs',null)
      addValueElm('no_bpjs','')
      addValueElm('tgl_masuk',null)
      addValueElm('tgl_keluar',null)
      addValueElm('status_pegawai',null)
      addValueElm('bidang',null)
      addValueElm('jabatan',null)
      addValueElm('group_kerja',null)
      addValueElm('bpjs',null)
      addValueElm('no_bpjs','')
      addValueElm('bank',null)
      addValueElm('no_rek_bank','')
      addValueElm('id_mesin',null)
      addValueElm('ptkp',null)
      addValueElm('status_all_in',null)
      //console.log("sinsinsisns")
      document.getElementById('nip').focus();
    } else {
      $("#form_input").addClass('hidden');
    }    
  }

  function SimpanKaryawan(){
    var obj = {};
    obj = PostUserInfo(obj);

    obj['kirim'] = "simpan_karyawan";
    obj['id'] = getValueElm('id') ;
    obj['pin'] = getValueElm('pin') ;
    obj['nip'] = getValueElm('nip') ;
    obj['nama'] = getValueElm('nama') ;
    obj['alamat'] = getValueElm('alamat') ;
    obj['kota'] = getValueElm('kota') ;
    obj['kelamin'] = getSelectValueElm('kelamin');
    obj['tlp'] = getValueElm('tlp') ;
    obj['email'] = getValueElm('email') ;
    obj['suami_istri'] = getValueElm('suami_istri') ;
    obj['anak'] = getValueElm('anak') ;
    obj['tgl_masuk'] = getValueElm('tgl_masuk') ;
    //obj['tgl_keluar'] = getValueElm('tgl_keluar') ;
        
    obj['status_pegawai'] = getSelectValueElm('status_pegawai') ;
    obj['bidang'] = getSelectValueElm('bidang') ;
    obj['jabatan'] = getSelectValueElm('jabatan') ;
    obj['group_kerja'] = getSelectValueElm('group_kerja') ;

    obj['no_bpjs_jht'] = getValueElm('no_bpjs_jht') ;
    obj['no_bpjs_kes'] = getValueElm('no_bpjs_kes') ;

    obj['bank'] = getSelectValueElm('bank') ;
    obj['no_rek_bank'] = getValueElm('no_rek_bank') ;

    obj['ptkp'] = getSelectValueElm('ptkp') ;
    //obj['status_all_in'] = getSelectValueElm('status_all_in') ;

    obj['id_mesin'] = getSelectValueElm('id_mesin') ;

    var tglKeluar=  getValueElm('tgl_keluar') ;
    var infoTanya = 'Simpan perubahan ??' ;
    if (tglKeluar!=''){
      infoTanya = 'Karyawan Sudah Keluar ??' ;
    }
    infoTanya = 'Simpan ??'

    var buttonsPlus = $('<div>')
    //.append(createButton('Simpan','sw_simpan','btn-warning'))
    //.append(createButton('Batal','sw_batal',''))
    .append('<hr/>')
    if (tglKeluar!=''){
      buttonsPlus .append(createMessage('Simpan = Simpan Perubahan (Karyawan tetap aktif)'))
      buttonsPlus .append(createMessage('Karyawan Keluar = Karyawan sudah keluar (Off)'))
      buttonsPlus .append('<hr/>')

      buttonsPlus .append(createButton('Simpan','sw_simpan','btn-primary'))
      buttonsPlus .append(createButton('Batal','sw_batal',''))
      buttonsPlus .append(createButton('Karyawan Keluar','sw_keluar','btn-danger'));
    } else {
      buttonsPlus .append(createButton('Simpan','sw_simpan','btn-primary'))
      buttonsPlus .append(createButton('Batal','sw_batal',''))

    }
    swal({
      title: infoTanya,
      html: buttonsPlus,
      type: 'question',
      showCancelButton: false,
      showConfirmButton: false,
      onOpen: function (dObj) {
        $('#sw_batal').on('click',function () {
          swal.close();
        });
        $('#sw_simpan').on('click',function () {
          ProsesSimpanKaryawan(obj)
        });
        $('#sw_keluar').on('click',function () {
          obj['tgl_keluar'] = getValueElm('tgl_keluar') ;
          ProsesSimpanKaryawan(obj)
        });
      }
    });
  }

  function ProsesSimpanKaryawan(obj){
    $.post(urlDB,obj,
      function(data,status){
        if (status=="success"){
          if (data=='1' || data=='ok'){
            SwalPopupSuccess('Berhasil disimpan')   ;
            //gotoJS('input','karyawan');
            FormInputKaryawan(0);
          } else {
            Swal.fire({type: 'error',title: data})
          }
        } else {
          Swal.fire({type: 'error',title: 'Gagal Proses'})
        };
      } 
      );  

  }


  function EditKaryawan(id,hapus){
    if (hapus!='undefined' && hapus!=null){
      Swal.queue([{
        title: 'Hapus ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_karyawan";
          obj['id'] = id;
          obj['hapus'] = 1 ;

          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil dihapus')   ;
                  gotoJS('kepegawaian','karyawan');
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
      
    } else {
      var obj = {};
      obj = PostUserInfo(obj);

      obj['kirim'] = 'list_karyawan' ;
      obj['id'] = id;
          
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            FormInputKaryawan();
            var jsAll = JSON.parse(data) ;
            var js = jsAll.list ;

            addValueElm('id',js.id)
            addValueElm('pin',js.pin2)
            addValueElm('nip',js.nip)
            addValueElm('nama',js.nama)
            addValueElm('alamat',js.alamat)
            addValueElm('kota',js.kota)
            addValueElm('kelamin',js.kelamin)
            addValueElm('tlp',js.no_telepon)
            addValueElm('email',js.email)
            addValueElm('suami_istri',js.suami_istri)
            addValueElm('anak',js.jumlah_anak)
            addValueElm('bpjs',js.bpjs)
            addValueElm('no_bpjs',js.no_bpjs)
            addValueElm('tgl_masuk',js.tgl_masuk)
            addValueElm('tgl_keluar',js.tgl_keluar)
            addValueElm('status_pegawai',js.status_pegawai)
            addValueElm('bidang',js.bidang)
            addValueElm('jabatan',js.jabatan)
            addValueElm('group_kerja',js.group_kerja)
            addValueElm('no_bpjs_jht',js.no_bpjs_jht)
            addValueElm('no_bpjs_kes',js.no_bpjs_kes)
            addValueElm('bank',js.bank)
            addValueElm('no_rek_bank',js.no_rek_bank)
            addValueElm('ptkp',js.ptkp)
            addValueElm('status_all_in',js.status_all_in)
            addValueElm('id_mesin',js.id_mesin)
            document.getElementById('form_input').scrollIntoView();       
            document.getElementById('nip').focus();
            
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'})
          };
        } 
      );  
    }
  }


  function InputCutiKaryawan(sts=1){
    if (sts==1){
      Swal.queue([{
        title: 'Simpan ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_cuti_karyawan";
          obj['id_karyawan'] = getValueElm('id_karyawan') ;
          obj['status_izin'] = getSelectValueElm('status_izin');
          obj['t_mulai'] = getValueElm('t_mulai') ;
          obj['j_mulai'] = getValueElm('j_mulai') ;
          obj['t_selesai'] = getValueElm('t_selesai') ;
          obj['j_selesai'] = getValueElm('j_selesai') ;
          obj['keterangan'] = getValueElm('keterangan') ;
          
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan') ;
                  GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/izin_sub.php','id='+getValueElm('id_karyawan'))
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
    } else {
      addValueElm('form_izin_cuti',"")
      document.getElementById('sub-content').innerHTML = "";
      document.getElementById('form_izin_cuti').focus();
    }
  }

  function HapusCutiKaryawan(id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "hapus_cuti_karyawan";
        obj['id'] = id;
        obj['id_karyawan'] = getValueElm('id_karyawan') ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/izin_sub.php','id='+getValueElm('id_karyawan'))
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }


  function InputPenghasilan(sts=1){
    if (sts==1){
      Swal.queue([{
        title: 'Simpan ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_input_penghasilan";
          obj['id_karyawan'] = getValueElm('id_karyawan') ;
          obj['nama'] = getValueElm('nama') ;
          obj['rupiah'] = getValueElm('rupiah') ;
          
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/penghasilan_sub.php','id='+getValueElm('id_karyawan'))
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
    } else {
      addValueElm('form_input_penghasilan',"")
      document.getElementById('sub-content').innerHTML = "";
      document.getElementById('form_input_penghasilan').focus();
    }
  }

  function HapusInputPenghasilan(id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "hapus_input_penghasilan";
        obj['id'] = id;
        obj['id_karyawan'] = getValueElm('id_karyawan') ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/penghasilan_sub.php','id='+getValueElm('id_karyawan'))
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }


  function InputPotongan(sts=1){
    if (sts==1){
      Swal.queue([{
        title: 'Simpan ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_input_potongan";
          obj['id_karyawan'] = getValueElm('id_karyawan') ;
          obj['nama'] = getValueElm('nama') ;
          obj['rupiah'] = getValueElm('rupiah') ;
          
          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/potongan_sub.php','id='+getValueElm('id_karyawan'))
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
    } else {
      addValueElm('form_input_potongan',"")
      document.getElementById('sub-content').innerHTML = "";
      document.getElementById('form_input_potongan').focus();
    }
  }

  function HapusInputPotongan(id){
    Swal.queue([{
      title: 'Hapus ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "hapus_input_potongan";
        obj['id'] = id;
        obj['id_karyawan'] = getValueElm('id_karyawan') ;

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              GetHtmlFromFile('sub-content',urlHome+'aplikasi/kepegawaian/potongan_sub.php','id='+getValueElm('id_karyawan'))
            } else {
              Swal.fire({type: 'error',title: 'Gagal Proses'})
            };
          } 
        );  
      }
    }])
  }


  function InputHariLibur(sts=1){
    if (sts==1){
      $("#form_main").addClass('col-md-7')
      $("#form_main").removeClass("col-md-12");  
      $("#form_input").removeClass("hidden");  

      addValueElm('id',0)
      addValueElm('tanggal','')
      addValueElm('keterangan','')
      document.getElementById('keterangan').focus();

    } else {
      $("#form_main").removeClass("col-md-7");  
      $("#form_main").addClass('col-md-12');
      $("#form_input").addClass('hidden');
    }
  }
  function SimpanInputHariLibur(){
    Swal.queue([{
      title: 'Simpan ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "simpan_hari_libur";
        obj['id'] = getValueElm('id') ;
        obj['tanggal'] = getValueElm('tanggal') ;
        obj['keterangan'] = getValueElm('keterangan') ;
        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil disimpan')   ;
                gotoJS('kepegawaian','libur');

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
  function EditInputHariLibur(id,hapus){
    if (hapus!='undefined' && hapus!=null){
      Swal.queue([{
        title: 'Hapus ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_hari_libur";
          obj['id'] = id;
          obj['hapus'] = 1 ;

          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil disimpan')   ;
                  gotoJS('kepegawaian','libur');
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
      
    } else {
      var obj = {};
      obj = PostUserInfo(obj);

      obj['kirim'] = 'list_hari_libur' ;
      obj['id'] = id;
          
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            InputHariLibur(1);
            var jsAll = JSON.parse(data) ;
            var js = jsAll.list ;

            addValueElm('id',js.id)
            addValueElm('tanggal',js.tanggal)
            addValueElm('keterangan',js.keterangan)
            
          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'})
          };
        } 
      );  
    }
  }


  function AddJabatan(sts=1){
    if (sts==1){
      
      $("#form_main").removeClass("col-md-12");  
      $("#form_main").addClass('col-md-7')

      $("#form_input").removeClass("hidden");  

      jSubPenghasilan = 0 ;
      jSubPotongan = 0 ;
      document.getElementById('form_sub_penghasilan').innerHTML = '';
      document.getElementById('form_sub_potongan').innerHTML = '';

      addValueElm('id',0)
      addValueElm('nama','')
      addValueElm('keterangan','')
      addValueElm('gapok',0)
      document.getElementById('nama').focus();

    } else {
      $("#form_main").removeClass("col-md-7");  
      $("#form_main").addClass('col-md-12');
      $("#form_input").addClass('hidden');

    }
  }

  function SimpanJabatan(){
    Swal.queue([{
      title: 'Simpan ??',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      type: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        
        var objPenghasilan = [];
        var ElmRp = document.getElementsByClassName("input_penghasilan"); 
        var ElmKet = document.getElementsByClassName("input_penghasilan_keterangan"); 
        var ElmLembur = document.getElementsByClassName("input_sts_lembur"); 
        var ElmPenghasilan = document.getElementsByClassName("input_sub_penghasilan");
        for(var i=0; i<ElmPenghasilan.length; i++) {
          var sLembur = 0 ; 
          var chk = ElmLembur[i].checked ; 
          if (chk){
            sLembur = 1;
          }

          var objElm = {};
          objElm['id'] = ElmPenghasilan[i].getAttribute("data-id") ; 
          objElm['rp'] = ElmRp[i].value ;
          objElm['hitung_lembur'] = sLembur ;
          objElm['keterangan'] = ElmKet[i].value ;
          objElm['hapus'] = ElmPenghasilan[i].getAttribute("data-hapus") ; 
          objPenghasilan.push(objElm);
        }

        var objPotongan = [];
        var ElmRp = document.getElementsByClassName("input_potongan"); 
        var ElmKet = document.getElementsByClassName("input_potongan_keterangan"); 
        var ElmPotongan = document.getElementsByClassName("input_sub_potongan");
        for(var i=0; i<ElmPotongan.length; i++) {
          var objElm = {};
          objElm['id'] = ElmPotongan[i].getAttribute("data-id") ; 
          objElm['rp'] = ElmRp[i].value ;
          objElm['keterangan'] = ElmKet[i].value ;
          objElm['hapus'] = ElmPotongan[i].getAttribute("data-hapus") ; 
          objPotongan.push(objElm);
        }


        var obj = {};
        obj = PostUserInfo(obj);
        obj['kirim'] = "simpan_jabatan";
        obj['id'] = getValueElm('id') ;
        obj['nama'] = getValueElm('nama') ;
        obj['keterangan'] = getValueElm('keterangan') ;
        obj['gapok'] = getValueElm('gapok') ;
        obj['bpjs_jht'] = getValueCheckboxElm('i_bpjs_jht',true) ;
        obj['bpjs_kes'] = getValueCheckboxElm('i_bpjs_kes',true) ;
        obj['iuran_jp'] = getValueCheckboxElm('i_iuran_jp',true) ;
        obj['penghasilan'] = objPenghasilan ;
        obj['potongan'] = objPotongan ;
        console.log(JSON.stringify(objPotongan))

        $.post(urlDB,obj,
          function(data,status){
            if (status=="success"){
              if (data=='1' || data=='ok'){
                SwalPopupSuccess('Berhasil');
                gotoJS('kepegawaian','mstjabatan');

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

  function EditJabatan(id,hapus){
    if (hapus!='undefined' && hapus!=null){
      Swal.queue([{
        title: 'Hapus ??',
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          var obj = {};
          obj = PostUserInfo(obj);
          obj['kirim'] = "simpan_jabatan";
          obj['id'] = id;
          obj['hapus'] = 1 ;

          $.post(urlDB,obj,
            function(data,status){
              if (status=="success"){
                if (data=='1' || data=='ok'){
                  SwalPopupSuccess('Berhasil dihapus');
                  gotoJS('kepegawaian','mstjabatan');

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
      
    } else {
      var obj = {};
      obj = PostUserInfo(obj);

      obj['kirim'] = 'list_jabatan' ;
      obj['id'] = id;
          
      $.post(urlDB,obj,
        function(data,status){
          if (status=="success"){
            AddJabatan();
            var jsAll = JSON.parse(data) ;
            var js = jsAll.list ;

            addValueElm('id',js.id)
            addValueElm('nama',js.nama)
            addValueElm('keterangan',js.keterangan)
            addValueElm('gapok',js.gapok)
            addValueCheckBoxElm('i_bpjs_jht',js.bpjs_jht)
            addValueCheckBoxElm('i_bpjs_kes',js.bpjs_kes)
            addValueCheckBoxElm('i_iuran_jp',js.iuran_jp)
            
            var listPenghasilan = js.list_penghasilan ;
            for (var x = 0; x < listPenghasilan.length; x++) {
              var dtArray = listPenghasilan[x]
              AddSubPenghasilan(0,dtArray.id,dtArray.rupiah,dtArray.nama,dtArray.perhitungan_lembur);

            }

            var listPotongan = js.list_potongan ;
            for (var x = 0; x < listPotongan.length; x++) {
              var dtArray = listPotongan[x]
              AddSubPotongan(0,dtArray.id,dtArray.rupiah,dtArray.nama);
            }

          } else {
            Swal.fire({type: 'error',title: 'Gagal Proses'})
          };
        } 
      );  
    }
  }


  function AddSubPenghasilan(sts=0,sID=0,sRp=0,sKet='',sLembur=0){
    if (sts==0){
      jSubPenghasilan++;
   
      var inp_sts = document.createElement("input");
      inp_sts.setAttribute("type","checkbox");
      inp_sts.setAttribute("class","form-control text-middle input_sts_lembur");
      inp_sts.setAttribute("placeholder","");
      inp_sts.setAttribute("title","");
      inp_sts.setAttribute("data-toggle","tooltip");
      inp_sts.setAttribute("data-original-title","Perhitungan Lembur");
      if (sLembur!='undefined' && sLembur!=null){
        if (sLembur==1){
          inp_sts.setAttribute("checked",true);  
        }
      }


      var div_sts = document.createElement("div");
      div_sts.setAttribute("class","col-md-1 p-0 m-0");
      div_sts.appendChild(inp_sts);


      var inp_k = document.createElement("input");
      inp_k.setAttribute("type","text");
      inp_k.setAttribute("class","form-control input_penghasilan_keterangan");
      if (sKet!='undefined' && sKet!=null){
        inp_k.value  = sKet ;
      }

      var div_k = document.createElement("div");
      div_k.setAttribute("class","col-md-5 p-0 m-0");
      div_k.appendChild(inp_k);


      var inp_rp = document.createElement("input");
      inp_rp.setAttribute("type","text");
      inp_rp.setAttribute("class","form-control input_penghasilan");
      if (sRp!='undefined' && sRp!=null){
        inp_rp.value  = sRp ;
      }


      var div_rp = document.createElement("div");
      div_rp.setAttribute("class","col-md-4 p-0 m-0");
      div_rp.appendChild(inp_rp);
      
      var inp_a = document.createElement("a");
      inp_a.setAttribute("href","#");
      inp_a.setAttribute("onclick","javascript: AddSubPenghasilan("+jSubPenghasilan+"); return false ;");
      inp_a.setAttribute("type","button");
      inp_a.setAttribute("class","btn btn-danger btn-sm waves-effect text-center ml-1");
      inp_a.innerHTML = "Hapus" ; 

      var div_a = document.createElement("div");
      div_a.setAttribute("class","col-md-2 p-0 m-0");
      div_a.appendChild(inp_a);


      var inp_hide = document.createElement("input");
      inp_hide.setAttribute("type","text");
      inp_hide.setAttribute("class","hidden input_sub_penghasilan");
      inp_hide.setAttribute("id","sub_id_penghasilan_"+jSubPenghasilan);
      inp_hide.setAttribute("data-id",0);
      inp_hide.setAttribute("data-hapus",0);
      if (sID!='undefined' && sID!=null){
        if (sID>0){
          inp_hide.setAttribute("data-id",sID);
        }
      }

      var element = document.createElement("div");
      element.setAttribute("class","d-flex flex-row my-1");
      element.setAttribute("id", "sub_div_penghasilan_"+jSubPenghasilan);
      element.appendChild(inp_hide);
      element.appendChild(div_sts);
      element.appendChild(div_k);
      element.appendChild(div_rp);
      element.appendChild(div_a);
      document.getElementById('form_sub_penghasilan').appendChild(element);
      ReloadJsFunc();
      
    } else {
      $("#sub_div_penghasilan_"+sts).removeClass("d-flex flex-row my-1");  
      $("#sub_div_penghasilan_"+sts).addClass('hidden');
      var elm = document.getElementById('sub_id_penghasilan_'+sts);
      elm.setAttribute("data-hapus",1);

    }

  }

  function AddSubPotongan(sts=0,sID=0,sRp=0,sKet=''){
    if (sts==0){
      jSubPotongan++;
   
      var inp_k = document.createElement("input");
      inp_k.setAttribute("type","text");
      inp_k.setAttribute("class","form-control input_potongan_keterangan");
      if (sKet!='undefined' && sKet!=null){
        inp_k.value  = sKet ;
      }

      var div_k = document.createElement("div");
      div_k.setAttribute("class","col-md-6 p-0 m-0");
      div_k.appendChild(inp_k);

      var inp_rp = document.createElement("input");
      inp_rp.setAttribute("type","text");
      inp_rp.setAttribute("class","form-control input_potongan");
      if (sRp!='undefined' && sRp!=null){
        inp_rp.value  = sRp ;
      }



      var div_rp = document.createElement("div");
      div_rp.setAttribute("class","col-md-4 p-0 m-0");
      div_rp.appendChild(inp_rp);
      
      var inp_a = document.createElement("a");
      inp_a.setAttribute("href","#");
      inp_a.setAttribute("onclick","javascript: AddSubPotongan("+jSubPotongan+"); return false ;");
      inp_a.setAttribute("type","button");
      inp_a.setAttribute("class","btn btn-danger btn-sm waves-effect text-center ml-1");
      inp_a.innerHTML = "Hapus" ; 

      var div_a = document.createElement("div");
      div_a.setAttribute("class","col-md-2 p-0 m-0");
      div_a.appendChild(inp_a);


      var inp_hide = document.createElement("input");
      inp_hide.setAttribute("type","text");
      inp_hide.setAttribute("class","hidden input_sub_potongan");
      inp_hide.setAttribute("id","sub_id_potongan_"+jSubPotongan);
      inp_hide.setAttribute("data-id",0);
      if (sID!='undefined' && sID!=null){
        if (sID>0){
          inp_hide.setAttribute("data-id",sID);
        }
      }
      inp_hide.setAttribute("data-hapus",0);

      var element = document.createElement("div");
      element.setAttribute("class","d-flex flex-row my-1");
      element.setAttribute("id", "sub_div_potongaan_"+jSubPotongan);
      element.appendChild(inp_hide);
      element.appendChild(div_k);
      element.appendChild(div_rp);
      element.appendChild(div_a);
      document.getElementById('form_sub_potongan').appendChild(element);
      
    } else {
      $("#sub_div_potongaan_"+sts).removeClass("d-flex flex-row my-1");  
      $("#sub_div_potongaan_"+sts).addClass('hidden');
      var elm = document.getElementById('sub_id_potongan_'+sts);
      elm.setAttribute("data-hapus",1);

    }

  }