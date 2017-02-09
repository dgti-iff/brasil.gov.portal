var PBrasil = {
    init: function(){
        this.main();
        this.addClassHtml();
        this.onclickBuscar();
        this.bugfixBase();
        this.carregaDestaques();
        this.bugfixQuerywidget();
    },

    main: function() {

        // simulando click no botao do portlet header via mobile
        // author: deserto digital
        $('.portletNavigationTree .portletHeader').click(function () {
            $(this).toggleClass('ativo');
            $(this).next().slideToggle();
        });

        var menuTrigger = $(".menuTrigger");
        var navigationEl = $("#navigation");

        menuTrigger.click(function (e) {
            e.preventDefault();
            navigationEl.toggleClass("ativo");
        });

        var sectionTrigger = $(".mobile .portletNavigationTree dt a");
        sectionTrigger.append("<span></span>");


        sectionTrigger.click(function (e) {
            e.preventDefault();
            $(this).parent().parent().toggleClass("ativo");
        });
        $("ul li:last-child").addClass("last-item");

        var responsiveResize, root;

        root = typeof exports !== "undefined" && exports !== null ? exports : this;

        root.ResponsiveResize = function () {
            var _Singleton, _base;
            _Singleton = (function () {
                function _Singleton() {}

                _Singleton.prototype.perspectiva_anterior = '';
                _Singleton.prototype.scrollbar = false;

                _Singleton.prototype.resize = function () {
                    var perspectiva_atual;

                    if ($(window).width() <= 480) {
                        perspectiva_atual = 'mobile';
                    } else {
                        perspectiva_atual = 'desktop';
                    }

                    if (this.perspectiva_anterior !== perspectiva_atual) {
                        this.perspectiva_anterior = perspectiva_atual;

                        if (perspectiva_atual === 'mobile') {
                            $("body").addClass("mobile");
                        } else { // Desktop
                            $("body").removeClass("mobile");
                        }
                    }
                };

                return _Singleton;
            })();


            if ((_base = root.ResponsiveResize).instance == null) {
                _base.instance = new _Singleton();
            }
            return root.ResponsiveResize.instance;
        };

        var resize = function () {
            responsiveResize = new root.ResponsiveResize();
            responsiveResize.resize();
        }

        $(window).resize(function () {
            resize();
        });

        resize();

        $('.newsImageContainer .photo-icon').on('click', function(e) {
            e.preventDefault();
            $('#parent-fieldname-image').trigger('click');
        });

    },

    addClassHtml: function(){

        $("#portal-column-one div:first-child").addClass("first-item");

        /* Protection from the Content Manager */
        var firstNavigation = $("#portal-column-one .portletWrapper .portletNavigationTree")[0];
        if(firstNavigation){
            $(firstNavigation).addClass("first-item-nav");
            var firstNavigationTitle = $("#portal-column-one .portletWrapper .portletNavigationTree .portletHeader")[0];
            if (firstNavigationTitle.textContent.indexOf('Menu de relevância')>1) {
                $(firstNavigation).parent('div').addClass("nav-menu-de-relevancia");
            }
        }

        if($('.link-externo').length > 0){
            $('.link-externo .collection-item:even').addClass ('even');
            $('.link-externo .collection-item:odd').addClass ('odd');
        }


    },

    onclickBuscar: function(){

        $('#link-buscar').click(function (e) {
            e.preventDefault();
            window.location.hash = '#portal-searchbox';
            $('.searchField').focus();
        });

    },

    /*
     * Bug fix para o bug de plone.formwidget.querystring versao acima de 1.0b3
     */
    bugfixQuerywidget: function(){
        if ($(".QueryWidget").length === 0) {
            return false;
        }
        $.querywidget.init();
        $('#sort_on').val($('#form-widgets-sort_on').val());
        if ($('#form-widgets-sort_reversed-0').attr('checked')) {
            $('#sort_order').attr('checked', true);
        } else {
            $('#sort_order').attr('checked', false);
        }
        $("#sort_on").live('click', function () {
            $('#form-widgets-sort_on').val($(this).val());
        });
        $("#sort_order").live('click', function () {
            if ($(this).is(":checked")) {
                $('#form-widgets-sort_reversed-0').attr('checked', true);
            } else {
                $('#form-widgets-sort_reversed-0').attr('checked', false);
            }
        });
        $('#formfield-form-widgets-sort_on').hide();
        $('#formfield-form-widgets-sort_reversed').hide();
    },

    /*
     * Bug fix para o bug de <base url=""> do Plone
     */
    bugfixBase: function(){

        if($("base").length > 0 && $(".userrole-anonymous").length > 0) {
            var aCurrentUrl = document.location.href.match(/(^[^#]*)/);

            $("base").attr("href", aCurrentUrl[1]);
        }
    },

    /*
     * Carrega capa /destaques no viewlet de destaques
     */
    carregaDestaques: function(){

        if ($('#featured-content').length > 0) {
            $('#featured-content').load(portal_url + '/destaques?ajax_load=1 #content > .row');
        }

    },

    albuns: {
        fixAlbumHeight: function() {
            if ($('.template-galeria_de_albuns').length > 0) {
                var albumResponsiveResize, root;
                root = typeof exports !== "undefined" && exports !== null ? exports : this;
                root.AlbumResponsiveResize = function () {
                    var _Singleton, _base;
                    _Singleton = (function () {
                        function _Singleton() {}
                        _Singleton.prototype.qtd_coluna_anterior = '';
                        _Singleton.prototype.scrollbar = false;
                        _Singleton.prototype.resize = function () {
                            var qtd_coluna_atual;
                            qtd_coluna_atual = 1;
                            if ($(window).width() > 480) {
                                qtd_coluna_atual = 2;
                            }
                            // 3 columns, 460 + 30 padding
                            if ($(window).width() > 960) {
                                qtd_coluna_atual = 3;
                            }
                            if (this.qtd_coluna_anterior !== qtd_coluna_atual) {
                                this.qtd_coluna_anterior = qtd_coluna_atual;
                                var top = 0;
                                var height = 0;
                                var lilist = [];
                                var $item, $lilist;
                                $('#gallery_albums li').each(function(index, item) {
                                    $item = $(item);
                                    $item.height('auto');
                                });
                                $('#gallery_albums li').each(function(index, item) {
                                    $item = $(item);
                                    // if line change
                                    if ((top > 0) &&
                                        (top != $item.offset().top)) {
                                        $lilist = $(lilist);
                                        $lilist.height(height);
                                        top = 0;
                                        height = 0;
                                        lilist = [];
                                    }
                                    top = $item.offset().top;
                                    lilist.push(item);
                                    if ($item.height() > height) {
                                        height = $item.height();
                                    }
                                });
                                $lilist = $(lilist);
                                $lilist.height(height);
                            }
                        };
                        return _Singleton;
                    })();
                    if ((_base = root.AlbumResponsiveResize).instance == null) {
                        _base.instance = new _Singleton();
                    }
                    return root.AlbumResponsiveResize.instance;
                };
                var resize = function () {
                    albumResponsiveResize = new root.AlbumResponsiveResize();
                    albumResponsiveResize.resize();
                }
                $(window).resize(function () {
                    resize();
                });
                resize();
            }
        }
    }
};

jQuery(document).ready(function ($) {
    "use strict";
    PBrasil.init();
    if (window.location.hostname != "selecoes.iff.edu.br") {
        $(".portletWrapper:nth-child(n+3) dt").each(function(){
          $(this).addClass("ativo");
        });

        $(".portletWrapper:nth-child(n+3) dd").each(function(){
          $(this).css("display", "none");
        });

        $(".portlet-static-centrais-de-conteudos dd").css("display", "");

        //if (window.location.pathname === "/") {
        //  $(".portletWrapper:nth-child(2) dd").each(function(){
        //    $(this).css("display", "none");
        //  });
        //}
    }

    $("#tile_banner_rotativo span.title").css("display", "none");

    if (window.location.href.startsWith("http://www.iff.edu.br/en")
       || window.location.href.startsWith("http://iff.edu.br/en"))
    {
        console.log("versao ingles");
        $(".doormatColumn.column-1 dt").after('<dd><p style="font-size: 9pt">Currently the IFFluminense offers three levels of professional qualification, working in initial and continuing Education, offering Technician and Technologist Degrees, Secondary Education, Youth and Adult Education, Teacher Education, Undergraduate and Graduate Degrees (Master´s).</p></dd>');
        $(".doormatColumn.column-2 dt").after('<dd><p style="font-size: 9pt">Rua Coronel Walter Kramer, 357 - Parque Santo Antônio - Campos dos Goytacazes, RJ - Zip Code 28080-565 Phone# +552227375624</p></dd>');
    } else {
        $(".doormatColumn.column-1 dt").after('<dd><p style="font-size: 9pt">Atualmente, o IFFluminense atua nos três níveis da formação profissional. Trabalhando na educação inicial e continuada de trabalhadores, oferece Cursos Técnicos e Cursos Superiores de Tecnologia, Ensino Médio, Educação de Jovens e Adultos, Licenciaturas, Cursos de Pós-Graduação e Mestrado.</p></dd>');
        $(".doormatColumn.column-2 dt").after('<dd><p style="font-size: 9pt">Rua Coronel Walter Kramer, 357 - Parque Santo Antônio - Campos dos Goytacazes, RJ - CEP 28080-565 Tel: (22) 2737-5624</p></dd>');
    }
});

function setaDisplay(){
    $('#em-destaque.closed li:not(:first-child)').css('display', 'none');
    $('#em-destaque.opened li:not(:first-child)').css('display', 'block');
}

$(window).load(function() {
    PBrasil.albuns.fixAlbumHeight();
    $("#em-destaque").addClass('closed');
    $("#em-destaque-titulo").click(function(){
        $("#em-destaque").toggleClass("closed opened");
        setTimeout(setaDisplay, 200);
    })
    $("#em-destaque-titulo").css("font-size","24px");
});

