var defST = { An: 0, Mb: 0 }; //default

function sjson(_s) {
    return encodeURIComponent(_s).replace("\"", "\\\"").replace("\'", "\\\'");
};

function sjson2(_s) { //for href use
    return encodeURIComponent(_s).replace("'", "%27");
};

function StringBuilder() {
    this.__asBuilder = [];
}
StringBuilder.prototype.clear = function () {
    this.__asBuilder = [];//这种写法要比this.__asBuilder.length = 0稍快,快多少，看数组的长度
}
StringBuilder.prototype.append = function () {
    Array.prototype.push.apply(this.__asBuilder, arguments);//调用Array的push方法，这样调用，使用append,可以传递多个参数
    return this;//这样可以实现append("a").append()的效果
}
StringBuilder.prototype.toString = function () {
    return this.__asBuilder.join("");
}

function toggleOddsSel(id) {
    if (document.getElementById(id).style.display == "none") {
        document.getElementById(id).style.display = "";
    }
    else {
        document.getElementById(id).style.display = "none";
    }
}

/***********************************************************************************************************************************/
var _dataM = {};
function setDtM(_ot, _rM) {
    if (_dataM[_ot] == null) {
        _dataM[_ot] = {};
    }
    _dataM[_ot][_rM[0]] = _rM;
};
function delDtM(_ot, _oddsid) {
    if (_dataM[_ot] != null) {
        delete _dataM[_ot][_oddsid];
    }
};
function updDtM(_ruM, _$tb, _ot) {
    var _oddsid = _ruM[0];
    if (_dataM[_ot][_oddsid] != null) {
        var _$trM = _$tb.find("[oddsid='" + _oddsid + "']");
        if (_$trM.length > 0) {
            var _$tbL = _$trM.parents("tbody[soclid]:first");
            var _LId = _$tbL.attr('soclid');
            var _LTitle = _$tbL.find('.L_Name:first').html();
            var _isAlt = _$tb.hasClass("GridAltRunItem") || _$tb.hasClass("GridAltItem");
            for (var i = 0, len = _ruM[1].length; i < len; i++) {
                _dataM[_ot][_oddsid][_ruM[1][i]] = _ruM[2][i];
            }
            addM_S(_dataM[_ot][_oddsid], _isAlt, (_ot == 'r'), _LId, _LTitle, _$tbL, false, _ot);
            return true;
        }
    }
    return false;
};

function adjTb(_$tbL, _IsMerge, _IsSoccerHDP) {
    var _isAlt = true, _ek = '', _preTr = null;
    _$tbL.find("tr[oddsid]").each(function () {
        var _$trM = $(this);

        if (_IsMerge) {
            //Is Not Soccer HDP, use eventkey instead of favid
            if (_IsSoccerHDP != null && _IsSoccerHDP == false) {
                if (_ek != _$trM.attr('eventkey')) { //Check the whether is firstOdds
                    _isAlt = !_isAlt;
                    _ek = _$trM.attr('eventkey');
                }
            }
            else {
                if (_ek != _$trM.attr('favid')) { //Check the whether is firstOdds
                    _isAlt = !_isAlt;
                    _ek = _$trM.attr('favid');
                }
            }
        } else {
            _isAlt = !_isAlt;
        }

        _$trM.css("background-color", ""); //Disable mouseover color replace the color

        if (_isAlt) {
            if (_$trM.hasClass('GridRunItem')) {
                _$trM.removeClass('GridRunItem').addClass('GridAltRunItem');
            }
            if (_$trM.hasClass('GridItem')) {
                _$trM.removeClass('GridItem').addClass('GridAltItem');
            }
        } else {
            if (_$trM.hasClass('GridAltRunItem')) {
                _$trM.removeClass('GridAltRunItem').addClass('GridRunItem');
            }
            if (_$trM.hasClass('GridAltItem')) {
                _$trM.removeClass('GridAltItem').addClass('GridItem');
            }
        }
        _preTr = _$trM;
    });
};

function adjTbMM(_$tbL, _IsMerge) {
    var _isAlt = true, _ek = '', _preTr = null;
    _$tbL.find("tr[oddsid]").not('[oddsid$="M"]').each(function () {
        var _$trM = $(this);

        if (_IsMerge) {
            if (_ek != _$trM.attr('favid')) { //Check the whether is firstOdds
                _isAlt = !_isAlt;
                _ek = _$trM.attr('favid');
            }
        } else {
            _isAlt = !_isAlt;
        }

        _$trM.css("background-color", ""); //Disable mouseover color replace the color

        if (_isAlt) {
            if (_$trM.hasClass('GridRunItem')) {
                _$trM.removeClass('GridRunItem').addClass('GridAltRunItem');
            }
            if (_$trM.hasClass('GridItem')) {
                _$trM.removeClass('GridItem').addClass('GridAltItem');
            }
        } else {
            if (_$trM.hasClass('GridAltRunItem')) {
                _$trM.removeClass('GridAltRunItem').addClass('GridRunItem');
            }
            if (_$trM.hasClass('GridAltItem')) {
                _$trM.removeClass('GridAltItem').addClass('GridItem');
            }
        }
        _preTr = _$trM;
    });
};

function dltAdj(_$tbL) {
    try{
        var _$tbL_P = _$tbL.prev('tbody[soclid]:first');
        var _$tbL_N = _$tbL.next('tbody[soclid]:first');

        if (_$tbL_P.attr['soclid'] == _$tbL_N.attr['soclid'])
        {
            var _$tr_N = _$tbL_N.find("tr[oddsid]");

            if(_$tr_N.length > 0)
            {
                for (var i = 0; i < _$tr_N.length; i++) {
                    _$tbL_P.find("tbody[soclid]:last").after(_$tr_N[i]);
                }
                _$tbL_N.remove();
            }
        }
    }
    catch(ex)
    {
        alert(ex.message);
    }
}

/*----------------------------------- Odds Function BEGIN -----------------------------------*/
//--------------- From SocOdds CLASS
function SocOddsIsAvailable(odds) {
    return (odds == 0 ? false : true);
}

function SocOddsIsAvailable3(odds1, odds2, hdpOdds) {
    if (hdpOdds == 0)
        return false;

    odds1 = odds1 / 10;
    odds2 = odds2 / 10;

    if (odds1 == 0 || odds2 == 0)
        return false;

    //Convert back to malay odds
    if (odds1 > 1 || odds1 < -1) {
        odds1 = -1 / odds1;
    }

    if (odds2 > 1 || odds2 < -1) {
        odds2 = -1 / odds2;
    }

    if (odds1 < 0 && odds2 < 0)
        return false;

    if (odds1 < 0 && odds2 > 0) {
        if (Math.abs(odds1) < odds2) {
            return false;
        }
    }
    else if (odds2 < 0 && odds1 > 0) {
        if (Math.abs(odds2) < odds1) {
            return false;
        }
    }

    return true;
}

function SocOddsIsAvailableOU(ou, runHomeScore, runAwayScore) {
    if (ou < 0)
        return false;
    else
        return (ou - (runHomeScore + runAwayScore) >= 0.5);
}

function SocOddsIsAvailable2(odds) {
    return ((odds <= 1) ? false : true);
}

function SocOddsIsAvailableX12(odds_1, odds_X, odds_2) {
    var IsAvailable = false;

    if (odds_1 <= 1 || odds_X <= 1 || odds_2 <= 1)
        IsAvailable = false;
    else
        IsAvailable = true;

    return IsAvailable;
}

function SocOddsIsAvailablePas(odds1, odds2) {
    return (((odds1 < 1.5) || (odds2 < 1.5)) ? false : true);
}

//---------- From Util CLASS

function UtilGetDisplayHdp(hdp) {
    if (hdp == -1) {
        return "";
    }
    else {
        if (hdp % 0.5 == 0)
            return hdp.toString();
        else
            return (parseFloat(hdp - 0.25) + "-" + parseFloat(hdp + 0.25));
    }
}

function UtilGetDisplayOddsLink(odds) {
    return Math.round(odds, 3);
}

function UtilGetDisplayOdds(odds) {
    odds /= 10;

    //Remark: The toFixed() method converts a number into a string, keeping a specified number of decimals.
    odds = odds.toFixed(3);
    var len = odds.length;
    var finalOdds;

    var res = odds.substr(len - 1, 1);

    if (res == 0)
        finalOdds = odds.substr(0, len - 1);
    else
        finalOdds = odds.substr(0, len);

    return finalOdds;
}

function UtilGetDisplayOdds2(odds) {
    //Remark: The toFixed() method converts a number into a string, keeping a specified number of decimals.
    odds = odds.toFixed(3);
    var len = odds.length;
    var finalOdds;

    var res = odds.substr(len - 1, 1);

    if (res == 0)
        finalOdds = odds.substr(0, len - 1);
    else
        finalOdds = odds.substr(0, len);

    return finalOdds;
}

function UtilGetDisplayOdds3(odds) {
    if (odds < 10)
        return odds.ToString("#0.0", null);

    return odds.ToString("#0", null);
}

function UtilGetDisplayOdds4(odds) {
    return odds;
}

function UtilIsAvailableMM(Pct) {
    if (Pct == -1)
        return false;
    else
        return true;
}

function UtilGetDisplayMMPct(pct) {
    if (pct < 0)
        return "<span class='MM_red'>(" + (parseFloat(pct.toString()) / 100.00).toString() + ")</span>";
    else
        return "<span class='MM_blue'>(" + (parseFloat(pct.toString()) / 100.00).toString() + ")</span>";
}

//JSon format using this
function UtilGetTextDecorationJS() {
    return "onmouseover=\"this.style.textDecoration='underline'\" onmouseout=\"this.style.textDecoration='none'\"";
}

/*----------------------------------- Odds Function END -----------------------------------*/

function GetClsOdds(odds) {

    if (odds < 0)
        return 'NegOdds';
    else
        return 'PosOdds';
}

function GetClsOddsMM(odds) {

    if (odds < 0)
        return 'MMNegOdds';
    else
        return 'MMPosOdds';
}

function GetClsOddsX12(odds) {
    return 'PosOdds';
}

function showBetBoxRU(url, idx, b, ot) { 
    var event = event || window.event || arguments.callee.caller.arguments[0];
    var _$this = $(event.target);
    var odds = _$this && (_$this.children().length > 0 ? _$this.children(":first").html() : _$this.html()) || 0;

    if (b == 'home' || b == 'away' || b == 'over' || b == 'under' ||
        b == 'homefh' || b == 'awayfh' || b == 'overfh' || b == 'underfh' ||
        b == 'mmhome' || b == 'mmaway' || b == 'mmover' || b == 'mmunder') {
        odds *= 10;
        odds = odds.toFixed(3);
    }

    url = url + '&odds=' + odds;
    parent.fraPanel.displayBetBox(url);
    parent.scrollTo(0, 0); //Redirect to TOP of panel
}

function showBetBox(url) { 
    parent.fraPanel.displayBetBox(url);
    parent.scrollTo(0, 0); //Redirect to TOP of panel
}

function showBetBoxPar(url) { //Parlay and Step disable auto redirect to TOP of panel
    parent.fraPanel.displayBetBox(url);
}

function ShowLoading() {
    var event = event || window.event || arguments.callee.caller.arguments[0];
    try{
        if (event && event.target) {
            var $load = $("#divloading");
            if ($load.length == 0) {
                $load = $("<img id=\"divloading\" style=\"position:absolute;display:none;\" src=\"../Images/spinner.gif\" align=\"absmiddle\" border=\"0\" alt=\"\" />");
                if ($(document.body).length == 0) return;
                $(document.body).append($load);
            }
            var _$this = $(event.target);
            var _left = (event.clientX || _$this.offset().left) + 10;
            if (_left > $(document.body).width() - 70) { _left = _left - 70; }
            $load.css("left", _left).css("top", (_$this.offset().top) + 16);
            $load.show();
        }
    }
    catch (e) {
        alert(e.toString());
    }
    return true;
};

function HideLoading() {
    $("#divloading") && $("#divloading").hide();
}

/* ----------------------------------------------- Get Early Selection BEGIN --------------------------------------------- */
function GetjsOdds_EM(_E_Sel) {
    var sb = new StringBuilder();

    sb.append("<table width='100%' border='1' cellspacing='0' cellpadding='0' class='GridBorder'>");
    sb.append("<tbody>");
    sb.append("<tr><td colspan='15' class='tdEM'>");
    sb.append("<div class='GridDate'>");
    if (_E_Sel.length > 0) {
        for (var i = 0; i < _E_Sel.length; i++) {
            sb.append("<div style='float:left;'><img src='../Images/arrowLeft.png' /><a class='" + ((_E_Sel[i][1] == _E_Sel[i][2]) ? "GridDate2" : "GridDate") + "' href='" + _E_Sel[i][0] + "' target='fraMain'>" + _E_Sel[i][3] + "</a></div>");
        }
    }
    sb.append("</div>");
    sb.append("</td></tr>");
    sb.append("</tbody>");
    sb.append("</table>");

    return sb.toString();
}
/* ----------------------------------------------- Get Early Selection END ---------------------------------------------- */

/* --------------------------------------------------- Pop up function BEGIN -------------------------------------------- */ 
function _$mouseLT(_obj) {
    var _t = _obj.offsetTop;
    var _l = _obj.offsetLeft;
    while (_obj = _obj.offsetParent) {
        _t += _obj.offsetTop;
        _l += _obj.offsetLeft;
    }
    return { x: _l, y: _t };
}

function _$MoreBets(_obj) {
    try {
        var _t = _$mouseLT(_obj).y;
        document.getElementById("_MoreBets").style.top = (_t + _obj.offsetHeight + 5) + 'px';
        document.getElementById("_MoreBets").style.display = "block";
    }
    catch (e) { }
}

function _$SelectLeague(_obj) {
    try {
        var _t = _$mouseLT(_obj).y;
        document.getElementById("_SelectLeague").style.top = (_t + _obj.offsetHeight + 1) + 'px';
        document.getElementById("_SelectLeague").style.left = '100px';
        document.getElementById("_SelectLeague").style.display = "block";
    }
    catch (e) { }
}
/* ----------------------------------------------------------- Pop up function END -------------------------------------------- */


/* ----------------------------------------------------------- No Odds Display BEGIN ------------------------------------------ */

function NoOddsDisplay(lang, colspan, css) {
    var sb = new StringBuilder();

    sb.append("<tr class='" + css + " NOEVENT' style='color:Black; font-weight:bold;'><td height='40px' align='center' colspan='" + colspan + "'>" + lang + "</td></tr>");

    return sb.toString();
}

/* ----------------------------------------------------------- No Odds Display END -------------------------------------------- */


/* ----------------------------------------------------------- Favourite BEGIN ------------------------------------------------ */
//SetAll in Favourite
function SetFavAll(_aFavAll, _ot, isAdd) {
    try {
        var _$tbL = $(_aFavAll).parents("tbody:first"); //Get the current tbody
        var soclid = _$tbL.attr("soclid"); //Get the current tbody soclid
        var _$tb = $(_aFavAll).closest(".GridBorder"); //Get the parent table
        var _$tbL2 = _$tb.find("[soclid='" + soclid + "']"); //Get the similar tbody with soclid
        var _imgs = _$tbL2.find("img[fav='0']");
        if (_imgs.length <= 0) {
            _imgs = _$tbL2.find("img[fav='1']");
        }
        for (var i = 0, len = _imgs.length; i < len; i++) {
            SetFavOne(_imgs[i], _ot, isAdd);
        }
    }
    catch (e) {
    }
}
//Set ONly One Odds in Favourite 
function SetFavOne(_aFavOne, _ot, isAdd) {
    var _$trM = $(_aFavOne).parents("[oddsid]:first");//Get the current match
    var _img = _$trM.find("img[fav]");//Get the favourite icon
    if (_img.attr("fav") == "0" && isAdd !== false) {
        isAdd = true;
        _img.attr("fav", "1");
        _img.attr("src", "../Images/FavAdd.gif");
    } else {
        isAdd = false;
        _img.attr("fav", "0");
        _img.attr("src", "../Images/FavOri.gif");
    }
    var _favid = _$trM.attr("favid");
    var url = 'Favourite.ashx?id=' + _favid + '&IsAdd=' + isAdd + '&ot=' + _ot;
    //Reload the page if uncheck the favourite icon
    jQuery.ajax({
        async: true, cache: false, url: url, complete: function () {
            if (isAdd === false) {
                if (_ot == 'r') {
                    typeof (ajaxRun) != 'undefined' && ajaxRun();
                } else {
                    typeof (ajaxToday) != 'undefined' && ajaxToday();
                }
            }
        }
    });
}

/* ----------------------------------------------------------- Favourite END ------------------------------------------------ */



/* ----------------------------------------------------------- FavouriteMM BEGIN ------------------------------------------------ */
//SetAll in Favourite
function SetFavAllMM(_aFavAll, _ot, isAdd) {
    try {
        var isAddAll = true; //To determine is isAll Favorite button clicked
        var _$tbL = $(_aFavAll).parents("tbody:first"); //Get the current tbody
        var soclid = _$tbL.attr("soclid"); //Get the current tbody soclid
        var _$tb = $(_aFavAll).closest(".GridBorder"); //Get the parent table
        var _$tbL2 = _$tb.find("[soclid='" + soclid + "']"); //Get the similar tbody with soclid
        var _imgs = _$tbL2.find("img[fav='0']");
        if (_imgs.length <= 0) {
            _imgs = _$tbL2.find("img[fav='1']");
        }
        for (var i = 0, len = _imgs.length; i < len; i++) {
            SetFavOneMM(_imgs[i], _ot, isAdd, isAddAll);
        }
    }
    catch (e) {
        //alert(e.toString());
    }
}
//Set ONly One Odds in Favourite 
function SetFavOneMM(_aFavOne, _ot, isAdd, isAddAll) {
    var _$trM = $(_aFavOne).parents("[oddsid]:first");//Get the current match
    var _img = _$trM.find("img[fav]");//Get the favourite icon
    //Since the isAll favorite button is clicked, no need check is myanmar odds or normal odds
    if (isAddAll == null || !isAddAll) {
        var id = _$trM.attr('oddsid');
        id = id.replace('M', '')
        var _$trM2 = _$trM.siblings("[oddsid*='" + id + "']");
    }

    if (_img.attr("fav") == "0" && isAdd !== false) {
        isAdd = true;
        _img.attr("fav", "1");
        _img.attr("src", "../Images/FavAdd.gif");
        //Since the isAll favorite button is clicked, no need check is myanmar odds or normal odds
        if ((isAddAll == null || !isAddAll) && _$trM2.length > 0) {
            var _img2 = _$trM2.find("img[fav]");//Get the favourite icon
            _img2.attr("fav", "1");
            _img2.attr("src", "../Images/FavAdd.gif");

        }
    } else {
        isAdd = false;
        _img.attr("fav", "0");
        _img.attr("src", "../Images/FavOri.gif");
        //Since the isAll favorite button is clicked, no need check is myanmar odds or normal odds
        if ((isAddAll == null || !isAddAll) && _$trM2.length > 0) {
            var _img2 = _$trM2.find("img[fav]");//Get the favourite icon
            _img2.attr("fav", "0");
            _img2.attr("src", "../Images/FavOri.gif");

        }
    }
    var _favid = _$trM.attr("favid");
    var url = 'FavouriteMM.ashx?id=' + _favid + '&IsAdd=' + isAdd + '&ot=' + _ot;
    //Reload the page if uncheck the favourite icon
    jQuery.ajax({
        async: true, cache: false, url: url, complete: function () {
            if (isAdd === false) {
                if (_ot == 'r') {
                    typeof (ajaxRun) != 'undefined' && ajaxRun();
                } else {
                    typeof (ajaxToday) != 'undefined' && ajaxToday();
                }
            }
        }
    });
}

/* ----------------------------------------------------------- FavouriteMM END ------------------------------------------------ */

function toggleMenu(objName, objId) {

    if (document.getElementById(objId).style.display == "none") {

        for (i = 0; i < document.getElementsByName(objName).length; i++) {
            document.getElementsByName(objName).item(i).style.display = "none";
        }

        document.getElementById(objId).style.display = "";
    }
    else {
        document.getElementById(objId).style.display = "none";
    }
}


//Hide the selection when click in browser anywhere
$(document).mouseover(function (e) {
    var container = $(".SelMenu");

    //if the target of the click isn't the container nor a descendant of the container
    if ((!container.is(e.target) && container.has(e.target).length == 0))
        container.hide();
});

/* LiveTV and Live Center */
function showTVSide(url) {
    if(!isMobileBrowser()) //Only SHOW on PC Browser
        window.open(url, 'fraLiveTV');
}

function showTVLarge(url) {
    window.open(url, 'LiveTV', 'width=600,height=540,top=200,left=400,toolbars=no,scrollbars=no,status=no,resizable=no');
}

function showLCSide(url) {
    if (!isMobileBrowser()) //Only SHOW on PC Browser
        window.open(url, 'fraLiveCenter');
}

function showLCLarge(url) {
    window.open(url, 'LiveCenter', 'width=430,height=550,top=200,left=400,toolbars=no,scrollbars=no,status=no,resizable=no');
}

function adjustContentWidth(width, compType) {
    if (compType != 1) {
        var strCols = parent.document.getElementById("fraSetMain").cols;
        var res = strCols.split(",");
        if (width > 0 || res[1] != 800) {
            var newWidth = 800 + width;
            parent.document.getElementById("fraSetMain").cols = "200," + newWidth + ",*";
        }
    }
}

function isMobileBrowser() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        return true;
    }

    return false;
}

//To reach a function written in parent, called from within iframe
function showBetBoxMB(url) {
    parent.showBetBox(url);
}

function shuffleElements($elements) {
    var i, index1, index2, temp_val;

    var count = $elements.length;
    var $parent = $elements.parent();
    var shuffled_array = [];


    // populate array of indexes
    for (i = 0; i < count; i++) {
        shuffled_array.push(i);
    }

    // shuffle indexes
    for (i = 0; i < count; i++) {
        index1 = (Math.random() * count) | 0;
        index2 = (Math.random() * count) | 0;

        temp_val = shuffled_array[index1];
        shuffled_array[index1] = shuffled_array[index2];
        shuffled_array[index2] = temp_val;
    }

    // apply random order to elements
    $elements.detach();
    for (i = 0; i < count; i++) {
        $parent.append($elements.eq(shuffled_array[i]));
    }
}

var isClicked = false;
function PopupCenter(pageURL, title, w, h) {
    if (isClicked) return;

    isClicked = true;
    setTimeout(function () {
        isClicked = false;
    }, 1000);

    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

//function closeWin() {
//    var someIframe = document.getElementById('_MiniBanner');
//    someIframe.parentNode.removeChild(document.getElementById('_MiniBanner'));

//    if (sessionStorage.getItem('_PgInfo') != null) {
//        var curST = JSON.parse(sessionStorage.getItem('_PgInfo'));
//        curST.Mb = 1;
//        sessionStorage.setItem('_PgInfo', JSON.stringify(curST));
//    }
//    else {
//        defST.Mb = 1;
//        sessionStorage.setItem('_PgInfo', JSON.stringify(defST));
//    }
//}

function GetSessionStorage(name, isJSon) {
    if (sessionStorage.getItem(name) !== null) {
        if (isJSon)
            return JSON.parse(sessionStorage.getItem(name));
        else
            return sessionStorage.getItem(name);
    }
    else {
        return null;   
    }
}

function closeWin() {
    var someIframe = document.getElementById('_MiniBanner');
    someIframe.parentNode.removeChild(document.getElementById('_MiniBanner'));
    SetST('_PgInfo', 'Mb', 1);
}

function SetST(keyST, name, value) {
    if (sessionStorage.getItem(keyST) != null) {
        var curST = JSON.parse(sessionStorage.getItem(keyST));
        curST[name] = value;
        sessionStorage.setItem(keyST, JSON.stringify(curST));
    }
    else {
        defST[name] = value;
        sessionStorage.setItem(keyST, JSON.stringify(defST));
    }
}

function GetST(keyST, name) {
    var result = null;
    if (sessionStorage.getItem(keyST) != null) {
        var curST = JSON.parse(sessionStorage.getItem(keyST));
        result = curST[name];
    }
    return result;
}
