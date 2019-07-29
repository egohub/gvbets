/*=========================================================================== JQuery Ajax Begin ======================================================================*/
var LID_S_R = "";
var LID_S_T = "";
var pm_S = [1, '', 'r', 0, 0, "EN-US", "OE1X2", 0, 0, 0];

var $tb_S_R = null; //Running table
var $tb_S_T = null; //Today table
var $tb_S_S = null;
var _urlSR = null;
var _urlST = null;

var sel = ""; //R and T ID
var selCss = ""; //R and T Css

var _timerR = null;
var _timerT = null;
var timeR = 25; //Default Running Refresh Time (Seconds)
var timeT = 40; //Default Today Refresh Time (Seconds)

function ajaxRun(url) {
    _urlSR = _urlSR || url;
    url = url || _urlSR;
    jQuery.ajax({
        async: true, cache: false, url: url + '&LID=' + LID_S_R, complete: function (_ort) {
            try {
                initDB_S_R(_ort.responseText);
                timerRun(url);
            }
            catch (e) {
                window.location.reload();
            }
            HideLoading();
        }
    });
};

function ajaxToday(url) {
    _urlST = _urlST || url;
    url = url || _urlST;
    jQuery.ajax({
        async: true, cache: false, url: url + '&LID=' + LID_S_T, complete: function (_ort) {
            try {
                initDB_S_T(_ort.responseText);
                timerToday(url);
            }
            catch (e) {
                window.location.reload();
            }
            HideLoading();
        }
    });
};

function SetDomEven_S() {
    $(document).ready(function () {
        //Running
        $tb_S_R = $('#tableRun');
        $tb_S_R.on("click", ".btnRefresh", function () {
            pm_S[3] == 1 && ShowLoading() && ajaxRun();
            return false;
        });

        //Today
        $tb_S_T = $('#tableToday');
        $tb_S_T.on("click", ".btnRefresh", function () {
            pm_S[3] == 1 && ShowLoading() && ajaxToday();
            return false;
        });

        //Separator
        $tb_S_S = $('#tableSeparator');
    });
};
SetDomEven_S();

function timerRun(url, _t) {
    if (_t != null)
        timeR = _t;

    if (_timerR != null)
        clearTimeout(_timerR);

    _timerR = setTimeout(function () { ajaxRun(url); }, timeR * 1000);
};

function timerToday(url, _t) {
    if (_t != null)
        timeT = _t;

    if (_timerT != null)
        clearTimeout(_timerT);

    _timerT = setTimeout(function () { ajaxToday(url); }, timeT * 1000);
};

function initDB_S_R(_cbstr) {
    try {
        if (_cbstr == "IgNoReReQuEsT") //TimeFilter
        {
            return;
        }
        sel = "R";
        selCss = "_R";
        var _data = eval("(" + _cbstr + ")");
        var _ot = _data[0][2];
        var title = RS_Running;
        if ($tb_S_R && $tb_S_R.length > 0) {
            updTB_S(_data, $tb_S_R, title, true, _ot);
        } else {
            $(document).ready(function () {
                updTB_S(_data, $tb_S_R, title, true, _ot);
            });
        }
        LID_S_R = _data[0][1];
    }
    catch (err) {
        //alert(err.message);
    }
}

function initDB_S_T(_cbstr) {
    try {
        if (_cbstr == "IgNoReReQuEsT") //TimeFilter
        {
            return;
        }
        sel = "T";
        selCss = "";
        var _data = eval("(" + _cbstr + ")");
        var _ot = _data[0][2];
        var title = (_ot == "e") ? RS_Early : RS_TodayEvents;
        if ($tb_S_T && $tb_S_T.length > 0) {
            updTB_S(_data, $tb_S_T, title, false, _ot);
        } else {
            $(document).ready(function () {
                updTB_S(_data, $tb_S_T, title, false, _ot);
            });
        }
        LID_S_T = _data[0][1];
    }
    catch (err) {
        //alert(err.message);
    }
}

function updTB_S(_data, _$tb, _hdtxt, _isRun, _ot) {
    pm_S = _data[0];
    if (_data[0][0] == 1) {
        //Draw Header
        drawHd_S(_$tb, _hdtxt, _data[4]);
        //Add All
        for (var i = 0, len = _data[2].length; i < len; i++) {
            addL_S(_data[2][i], true, _$tb, _isRun, _ot);
        }
    }
    else {
        //process "1" = Add New SocOdds
        //process "2" = Update SocOdds
        var process = "";

        //New Add
        for (var i = 0, len = _data[2].length; i < len; i++) {
            process = "1";
            addL_S(_data[2][i], false, _$tb, _isRun, _ot, process);
        }
        //Update
        for (var i = 0, len = _data[3].length; i < len; i++) {
            process = "2";
            addL_S(_data[3][i], false, _$tb, _isRun, _ot, process);
        }
        //delete
        for (var i = 0, len = _data[1].length; i < len; i++) {
            delM_S(_data[1][i], _$tb, _ot);
        }
    }

    //Remove blink effect after refresh
    _$tb.find(".NewOdds").each(function () {
        _$this = $(this);
        var _tms = _$this.attr("chgTms") || 0;
        _tms++;
        if (_tms > 1) { _$this.removeClass("NewOdds"); _$this.css("background", ""); _tms = 0; }
        _$this.attr("chgTms", _tms);
    });

    //if is sortbytime, if is Add and Delete process
    if (_data[0][8] == 1 && (_data[2].length > 0 || _data[1].length > 0)) {
        var _$tbL = _$tb.find("tbody[soclid]");
        for (var i = _$tbL.length; i >= 1 ; i--) {
            if (_$tbL.eq(i).attr('soclid') == _$tbL.eq(i - 1).attr('soclid')) {
                var _$trM = _$tbL.eq(i).find("tr[oddsid]");

                if (_$trM.length > 0) {
                    for (var j = 0; j < _$trM.length; j++) {
                        _$tbL.eq(i - 1).find("tr[oddsid]").last().after(_$trM.eq(j));
                    }
                    _$tbL.eq(i).remove();
                    adjTbMM(_$tbL.eq(i - 1), true); //Adjust Row Color
                }
            }
        }
    }

    //No Odds Display
    //Today & Early
    if (ot != "r") {
        if (_isRun) {
            if (_$tb.find(".M_Item").length <= 0) {
                _$tb.hide();
                $tb_S_S.css("display", "none");
            }
            else {
                _$tb.show();
                $tb_S_S.css("display", "");
            }
        }
        else {
            if (_$tb.find(".M_Item").length <= 0) {
                var _$tbL = _$tb.find("tbody[soclid='0']");
                if (_$tbL.find(".NOEVENT").length <= 0)
                    _$tbL.append(NoOddsDisplay(RS_NoEvents, 9, "GridItem"));
            }
        }
    }
    //Extra Checking for running when click live tab will display NoOdds Msg when no odds available
    //Running
    else {
        if (_$tb.find(".M_Item").length <= 0) {
            var _$tbL = _$tb.find("tbody[soclid='0']");
            if (_$tbL.find(".NOEVENT").length <= 0)
                _$tbL.append(NoOddsDisplay(RS_NoEvents, 9, "GridRunItem"));
        }
    }
};

/* Create the table and header */
function drawHd_S(_$tb, _hdtxt, _E_Sel) {
    var sb = new StringBuilder();

    //for whole table
    sb.append("<table width='100%' border='0' cellpadding='0' cellspacing='0'>");
    sb.append("<tbody>");
    sb.append("<tr>");
    if (_hdtxt != "") {
        sb.append("<td width='20px' align='left' background='../Images/barL.png'><img src='../Images/icoleft.png' width='15' height='15' align='absmiddle' /></td>");
        sb.append("<td background='../Images/barC.png'><table width='100%' height='25px' cellpadding='0' cellspacing='0'>");
        sb.append("<tr>");
        sb.append("<td><span class='GridTitle'>" + _hdtxt + "</span></td>");
    }
    else {
        sb.append("<td><table border='0' cellpadding='2' cellspacing='0' width='100%'>");
        sb.append("<tr><td align='left'>&nbsp;&nbsp;&nbsp;");
        sb.append("</td>");
    }
    //subButton
    sb.append("<td align='right'>");
    sb.append("<div style='float:right;'>");
    //sortBy
    if (ACC_SortBy == 1)
        sb.append("<div style='float:left; width:138px;'><a class='btnGrey' href='MOdds1Sim.aspx?ot=" + ot + "&sort=0'><span>" + RS_SortbyLeague + "</span></a></div>");
    else
        sb.append("<div style='float:left; width:138px;'><a class='btnGrey' href='MOdds1Sim.aspx?ot=" + ot + "&sort=1'><span>" + RS_SortbyTime + "</span></a></div>");
    //selectLeague
    sb.append("<div style='float:left;'><a class='btnGrey btnSelectLeague' href='selectleague.aspx?ot=" + ot + "&oview=" + oview + "' target='_iSelectLeague' onclick='_$SelectLeague(this);'><span>" + RS_SelectLeague2 + "</span></a></div>");
    //double single line
    sb.append("<div style='width:90px; float:left;' class='divOddsSel' onclick=\"toggleOddsSel('divPT_" + sel + "')\">");
    sb.append("<span>" + (pm_S[7] == 0 ? RS_Odds_DoubleLine1 : pm_S[7] == 1 ? RS_Odds_DoubleLine2 : pm_S[7] == 2 ? RS_Odds_SingleLine : RS_Odds_Simple) + "</span>");
    sb.append("<div class='OddsSel' id='divPT_" + sel + "' style='width:90px; position:absolute; display:none;'>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('MOdds2_1.aspx?ot=" + ot + "&oview=0', 'fraMain')\"><a href='MOdds2_1.aspx?ot=" + ot + "&oview=0' target='fraMain' class='OddsSel2'>" + RS_Odds_DoubleLine1 + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('MOdds2_2.aspx?ot=" + ot + "&oview=1', 'fraMain')\"><a href='MOdds2_2.aspx?ot=" + ot + "&oview=1' target='fraMain' class='OddsSel2'>" + RS_Odds_DoubleLine2 + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('MOdds1.aspx?ot=" + ot + "&oview=2', 'fraMain')\"><a href='MOdds1.aspx?ot=" + ot + "&oview=2' target='fraMain' class='OddsSel2'>" + RS_Odds_SingleLine + "</a><br /></div>");
    sb.append("<div class='OddsSel2Bg' onclick=\"window.open('MOdds1Sim.aspx?ot=" + ot + "&oview=3', 'fraMain')\"><a href='MOdds1Sim.aspx?ot=" + ot + "&oview=3' target='fraMain' class='OddsSel2'>" + RS_Odds_Simple + "</a><br /></div>");
    sb.append("</div></div>");
    //refresh
    sb.append("<div style='float:left;'><a class='btnGrey btnRefresh' href='#'><span>" + RS_btnRefresh + "</span></a></div>");
    sb.append("</div>");
    sb.append("</td>");
    //subButton END
    sb.append("</tr>");
    sb.append("</table></td>");
    sb.append("<td width='10px' background='../Images/barR.png'>&nbsp;</td>");
    sb.append("</tr>");
    sb.append("</tbody>");
    sb.append("</table>");

    //Early Selection
    if (ot == 'e')
        sb.append(GetjsOdds_EM(_E_Sel));

    sb.append("<table width='100%' border='1' cellpadding='0' cellspacing='0' class='GridBorder'>");
    sb.append("<colgroup>");
    sb.append("<col style='width: 45px;'></col>");
    sb.append("<col style='width: auto;'></col>");
    sb.append("<col style='width: 50px;'></col>");
    sb.append("<col style='width: 65px;'></col>");
    sb.append("<col style='width: 65px;'></col>");
    sb.append("<col style='width: 50px;'></col>");
    sb.append("<col style='width: 65px;'></col>");
    sb.append("<col style='width: 65px;'></col>");
    sb.append("<col style='width: 20px;'></col>");
    sb.append("</colgroup>");
    sb.append("<tbody soclid='0' border='0'>");
    //start table items
    sb.append("<tr class='GridHeader'>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:45px;' title='" + RS_Odds_Time + "'>" + RS_Odds_Time + "</td>");
    sb.append("<td class='table_th2" + selCss + "' align='center' nowrap='nowrap' style='width:330px;' title='" + RS_Event + "'>" + RS_Event + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:50px;' title='" + RS_Odds_FTHDP + "'>" + RS_Odds_FTHDP_2 + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:65px;' title='" + RS_HOME + "'>" + RS_HOME_2 + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:65px;' title='" + RS_AWAY + "'>" + RS_AWAY_2 + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:50px;' title='" + RS_Odds_FTOU + "'>" + RS_Odds_FTOU_2 + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:65px;' title='" + RS_Odds_OVER + "'>" + RS_Odds_OVER_2 + "</td>");
    sb.append("<td class='table_th1" + selCss + "' align='center' nowrap='nowrap' style='width:85px;' colspan='2' title='" + RS_Odds_UNDER + "'>" + RS_Odds_UNDER_2 + "</td>");
    sb.append("</tr>");

    //end table items
    sb.append("</tbody>");

    sb.append("</table>"); //end whole table

    _$tb.empty().html(sb.toString());
}

function addL_S(_rL, updAll, _$tb, _isRun, _ot, process) {
    var sb = new StringBuilder();
    var _$tbL;
    var _IsNewL = false;
    var _$tbNew = null;

    if (updAll) {
        _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
        _IsNewL = true;
    } else {
        _$tbL = _$tb.find("[soclid='" + _rL[0][0] + "']");

        //Only handle when SortByTime
        if (pm_S[8] == 1) {
            var _$curTm = _$tbL.find("[oddsid='" + _rL[1][0][0] + "']"); // Current Odds
            var _$curTbL = _$curTm.parents("tbody[soclid]:first");
            var _$preTm = _$tb.find("[oddsid='" + _rL[1][0][83] + "']"); // Get the Presocdds
            var _$preTbL = _$preTm.parents("tbody[soclid]:first"); // Get the Whole tbody by PreSocOdds

            if (process == 1) {
                if (_$curTm.length == 0) {
                    if (_$preTbL.attr('soclid') != _rL[0][0]) {
                        _IsNewL = true;
                        _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
                    }
                }

            }
        }

        if (_$tbL.length == 0) {
            _IsNewL = true;
            _$tbL = $("<tbody class='GridBg2' soclid='" + _rL[0][0] + "'></tbody> ");
        }
    }
    if (_IsNewL) {
        sb.append("<tr class='Event' align='Center'>");
        sb.append("<td>&nbsp;</td>");
        sb.append("<td colspan='6' align='left' style='height:20px; padding-left:5px; width:*;' class='L_Name btnRefresh'>" + _rL[0][1]);
        if (_rL[0][2] != "") {
            //sb.append("&nbsp;&nbsp;<img alt='' src='../Images/IconInfo.gif' style='cursor:pointer;' align='absmiddle' title='" + _rL[0][2] + "' />");
            sb.append("(" + _rL[0][2] + ")");
        }
        sb.append("</td>");
        sb.append("<td width='15px' align='right'>");
        sb.append("<a href='#' onclick=\"SetFavAllMM(this,'" + _ot + "');return false;\");return false;\" style='padding-bottom:3px;'><img title='Add All' src='../Images/FavAdd.gif' border='0' align='absmiddle'/></a>");
        sb.append("</td>");
        sb.append("<td width='20px' align='center'>");
        sb.append("<a href='#' class='btnRefresh'><img src='" + ("../Images/or" + RS_LangCol + ".gif") + "' border='0' align='absmiddle'></a>");
        sb.append("</td>");
        sb.append("</tr>");

        _$tbL.html(sb.toString());
        if (updAll) {
            _$tb.find("tbody[soclid]:last").after(_$tbL);
        }
        else {
            var _$preTm = _$tb.find("[oddsid='" + _rL[1][0][83] + "']");
            if (_$preTm == null || _$preTm.length <= 0) {
                if (_isRun) { LID_S_R = ''; ajaxRun(); } else { LID_S_T = ''; ajaxToday(); } return;
            }
            else {
                //Only handle when SortByTime and New league (tbody)
                if (pm_S[8] == 1 && _IsNewL) {
                    var _$next = _$preTm.next();
                    if (_$next.hasClass("GridRM"))
                        _$preTm = _$next;
                    var _$nextAll = _$preTm.nextAll();
                    if (_$nextAll.length > 0) {
                        _$tbNew = _$preTm.parents("tbody[soclid]:first").clone();
                        _$tbNew.children("tr[oddsid]").remove();
                        _$tbNew.append(_$nextAll);
                        _$preTm.nextAll().remove();
                        adjTbMM(_$tbNew, true);
                    }
                }
            }
            _$preTm.parents("tbody[soclid]:first").after(_$tbL);
            if (_$tbNew != null)
                _$tbL.after(_$tbNew);
        }
    }
    var _isAlt = true;
    for (var i = 0, len = _rL[1].length; i < len; i++) {
        if (_rL[1][i][6]) { _isAlt = !_isAlt; }
        addM_S(_rL[1][i], _isAlt, _isRun, _rL[0][0], _rL[0][1], _$tbL, _IsNewL, _ot, process);
        setDtM(_ot, _rL[1][i]);
    }
};

function addM_S(_rM, _isAlt, _isRun, _LId, _LTitle, _$tbL, _IsNewL, _ot, process) {
    var _FavId = _LId + "," + _rM[59] + "," + _rM[60];
    var key = _rM[0] + "E" + _LId + "|" + _rM[59] + "|" + _rM[60];

    //Draw Odds Row
    var visible = false;
    var parOt = _ot; //param Ot for showBetBoxRU funct
    var HDPBG = "";

    var sb = new StringBuilder();
    var sb2 = new StringBuilder();
    var mouseOutColor = "";
    var itemClass = "";

    if (_isRun) {
        if (_isAlt) {
            itemClass = "GridAltRunItem";
            mouseOutColor = C_Mcl[4];// jsRec.AltRunMouseOutColor;
            HDPBG = "HDPBG_GridAltRunItem";
        }
        else {
            itemClass = "GridRunItem";
            mouseOutColor = C_Mcl[3];// jsRec.RunMouseOutColor;
            HDPBG = "HDPBG_GridRunItem";
        }
    }
    else {
        if (_isAlt) {
            itemClass = "GridAltItem";
            mouseOutColor = C_Mcl[2];// jsRec.AltMouseOutColor;
            HDPBG = "HDPBG_GridAltItem";
        }
        else {
            itemClass = "GridItem";
            mouseOutColor = C_Mcl[1];//jsRec.MouseOutColor;
            HDPBG = "HDPBG_GridItem";
        }
    }
    var mouseOverColor = C_Mcl[0];// jsRec.MouseOverColor;

    var OddsBg = (_isRun ? (_isAlt ? "../Images/altrunitemnew.gif" : "../Images/runitemnew.gif") : (_isAlt ? "../Images/altitemnew.gif" : "../Images/itemnew.gif"));

    var _IsMM = (!_rM[77] && (_rM[65] != -1 || _rM[68] != -1));

    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
    /*-------------------------------------------------------------------------- Myanmar Odds BEGIN --------------------------------------------------------------------------*/
    if (_IsMM) {
        var strMMHdp = (((UtilIsAvailableMM(_rM[65]) && !_rM[77]) && _rM[8]) ? (_rM[63] + UtilGetDisplayMMPct(_rM[65])) : "");
        var strMMOU = (((UtilIsAvailableMM(_rM[68]) && !_rM[77]) && _rM[9]) ? (_rM[66] + UtilGetDisplayMMPct(_rM[68])) : "");

        /*------------------------------ SAME Event appear once BEGIN ------------------------------*/
        if (_rM[6]) {
            //Time
            sb.append("<td align='Center' style='width:45px;'>");
            //------------------------------ Time CONTENT
            sb.append("<span class='Heading5'>");
            sb.append(_rM[17]);
            sb.append(_rM[17] != "" ? "<br>" : "");
            sb.append(_rM[38] ? "<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span><br />" : "");
            sb.append(((_rM[14] && _rM[13] && _rM[0] != -1) ? ("<span class='HalfTime'>" + RS_HTIME + "</span>") : ""));
            sb.append(((_rM[0] != -1) && !_rM[12] && !_rM[14]) ? _rM[3] : "");
            sb.append(((_rM[0] != -1) && _rM[12] && !_rM[14]) ? "<img alt='' src='../Images/lastcall.gif'>" : "");
            sb.append("</span>");
            sb.append("<span class='Heading7'>");

            if (_rM[0] != -1 && _rM[44] != 0 && _rM[43] >= 0) {
                var strInjuryTime = "";
                if (_rM[61] > 0)
                    strInjuryTime = "<span class='OddsInjTime'>" + "+" + _rM[61] + "</span>";

                sb.append("<span class='HeadingTime'>");
                if (_rM[44] == 1)
                    sb.append((_rM[43] > 45) ? ("1H 45") : ("1H " + _rM[43]));
                else if (_rM[44] == 2)
                    sb.append((_rM[43] > 45) ? ("2H 45") : ("2H " + _rM[43]));
                else if (_rM[44] == 3)
                    sb.append((_rM[43] > 15) ? ("1E 15") : ("1E " + _rM[43]));
                else if (_rM[44] == 4)
                    sb.append((_rM[43] > 15) ? ("2E 15") : ("2E " + _rM[43]));
                sb.append(strInjuryTime);
                sb.append("</span>");
            }
            else {
                if (_rM[14]) {
                    sb.append((_rM[13] ? "" : ("<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span>")));
                }
            }

            sb.append("</span>");
            //------------------------------ Time CONTENT
            sb.append("</td>");

            //Home Away (Event)
            sb.append("<td align='left' style='padding-left:5px; width:*px;'>");
            sb.append("<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0' class='StrStyleSoc'><tr>");

            sb.append("<td align='left' style='width:*;'>");
            //------------------------------ Home Away (Event) CONTENT
            if (ACC_TeamView == 1) {
                //display Home -vs- Away
                sb.append((_rM[45] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[45] + ".gif'>" : "");
                sb.append("&nbsp;");

                visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
                if (visible)
                    sb.append("<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[4] + "</span>");

                sb.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
                sb.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
                sb.append("&nbsp;<span class='Heading5'>-vs-</span>&nbsp;");

                visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
                if (visible)
                    sb.append("<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[5] + "</span>");

                sb.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
                sb.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));

                sb.append("&nbsp;");
                sb.append((_rM[46] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[46] + ".gif'>" : "");
            }
            else {
                //sb.append("&nbsp;&nbsp;");

                visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
                if (visible)
                    sb.append("<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[4] + "</span>");

                sb.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
                sb.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
                sb.append((_rM[45] > 0) ? "&nbsp;<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[45] + ".gif'>" : "");
                sb.append("<br>");
                //sb.append("&nbsp;&nbsp;");

                visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
                if (visible)
                    sb.append("<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[5] + "</span>");

                sb.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
                sb.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (!_rM[75] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
                sb.append((_rM[46] > 0) ? "&nbsp;<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[46] + ".gif'>" : "");
            }
            //------------------------------ Home Away (Event) CONTENT
            sb.append("</td>");
            if (!_rM[14]) {
                if (_rM[56] > 0 && !pm_S[4]) {
                    sb.append("<td width='15px' align='center' valign='middle'>");
                    sb.append("<img src='../Images/tv.gif' border='0' align='absmiddle' />");
                    sb.append("</td>");
                }
                if (_rM[57] > 0) {
                    sb.append("<td width='15px' align='center' valign='middle'>");
                    sb.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle' />");
                    sb.append("</td>");
                }
            }
            sb.append("<td width='15px' align='center'>");
            sb.append("<a href='#' onclick=\"SetFavOneMM(this,'" + _ot + "');return false;\"><img fav='" + _rM[79] + "' src='.." + (_rM[79] == 1 ? "/Images/FavAdd.gif" : "/Images/FavOri.gif") + "' border='0' align='absmiddle'/></a>");
            sb.append("</td>");

            sb.append("</tr></table>");
            sb.append("</td>");
        }
        else {
            sb.append("<td>&nbsp;</td>"); //Time
            sb.append("<td>&nbsp;</td>"); //Home Away (Event)
        }
        /*------------------------------ SAME Event appear once END ------------------------------*/

        //HDP
        sb.append("<td align='Center' class='" + HDPBG + "' nowrap='nowrap' style='width:50px;'>");
        sb.append("<span class='MMHeading8'>");
        sb.append(strMMHdp == "" ? "&nbsp;" : (_rM[75] ? (strMMHdp + "H") : (strMMHdp + "A")));
        sb.append("</span>");
        sb.append("</td>");

        //HomeOdds
        sb.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
        //------------------------------ Odds CONTENT
        //ReadOnly
        if ((UtilIsAvailableMM(_rM[65]) && !_rM[77]) && _rM[8] && (!_rM[15] || !pm_S[3]))
            sb.append("<span class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
            //Betable
        else if ((UtilIsAvailableMM(_rM[65]) && !_rM[77]) && _rM[8] && _rM[15] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmhome&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmhome', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
            //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmhome&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmhome', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("</td>");

        //AwayOdds
        sb.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
        //------------------------------ Odds CONTENT
        //ReadOnly
        if ((UtilIsAvailableMM(_rM[65]) && !_rM[77]) && _rM[8] && (!_rM[15] || !pm_S[3]))
            sb.append("<span class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
            //Betable
        else if ((UtilIsAvailableMM(_rM[65]) && !_rM[77]) && _rM[8] && _rM[15] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmaway&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmaway', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
            //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[64] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmaway&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmaway', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[64]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("</td>");

        //OU
        sb.append("<td align='Center' class='" + HDPBG + "' nowrap='nowrap' style='width:50px;'>");
        sb.append("<span class='MMHeading8'>");
        sb.append(strMMOU);
        sb.append("</span>");
        sb.append("</td>");

        //OverOdds
        sb.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
        //------------------------------ Odds CONTENT
        //ReadOnly
        if ((UtilIsAvailableMM(_rM[68]) && !_rM[77]) && _rM[9] && (!_rM[15] || !pm_S[3]))
            sb.append("<span class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
            //Betable
        else if ((UtilIsAvailableMM(_rM[68]) && !_rM[77]) && _rM[9] && _rM[15] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmover&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmover', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
            //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmover&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmover', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("</td>");

        //UnderOdds
        sb.append("<td align='Center' nowrap='nowrap' style='width:65px;' class='SEP_R'>");
        //------------------------------ Odds CONTENT
        //ReadOnly
        if ((UtilIsAvailableMM(_rM[68]) && !_rM[77]) && _rM[9] && (!_rM[15] || !pm_S[3]))
            sb.append("<span class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
            //Betable
        else if ((UtilIsAvailableMM(_rM[68]) && !_rM[77]) && _rM[9] && _rM[15] && pm_S[3])
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmunder&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmunder', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
            //Hide
        else
            sb.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[67] < 0 ? "MMNegOdds" : "MMPosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=mmunder&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'mmunder', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[67]) + "</label>" + "</span>");
        //------------------------------ Odds CONTENT
        sb.append("</td>");

        if (_rM[6]) {
            //More Bets
            sb.append("<td align='center' nowrap='nowrap' style='width:20px;'>");
            sb.append("&nbsp;");
            sb.append("</td>");
        }
        else {
            sb.append("<td align='center' nowrap='nowrap' style='width:20px;'>&nbsp;</td>");
        }
    }
    /*-------------------------------------------------------------------------- Myanmar Odds END --------------------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

    /*------------------------------ SAME Event appear once BEGIN ------------------------------*/
    if (_rM[6]) {
        //Time
        sb2.append("<td align='Center' style='width:45px;'>");
        //------------------------------ Time CONTENT
        sb2.append("<span class='Heading5'>");
        sb2.append(_rM[17]);
        sb2.append(_rM[17] != "" ? "<br>" : "");
        sb2.append(_rM[38] ? "<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span><br />" : "");
        sb2.append(((_rM[14] && _rM[13] && _rM[0] != -1) ? ("<span class='HalfTime'>" + RS_HTIME + "</span>") : ""));
        sb2.append(((_rM[0] != -1) && !_rM[12] && !_rM[14]) ? _rM[3] : "");
        sb2.append(((_rM[0] != -1) && _rM[12] && !_rM[14]) ? "<img alt='' src='../Images/lastcall.gif'>" : "");
        sb2.append("</span>");
        sb2.append("<span class='Heading7'>");

        if (_rM[0] != -1 && _rM[44] != 0 && _rM[43] >= 0) {
            var strInjuryTime = "";
            if (_rM[61] > 0)
                strInjuryTime = "<span class='OddsInjTime'>" + "+" + _rM[61] + "</span>";

            sb2.append("<span class='HeadingTime'>");
            if (_rM[44] == 1)
                sb2.append((_rM[43] > 45) ? ("1H 45") : ("1H " + _rM[43]));
            else if (_rM[44] == 2)
                sb2.append((_rM[43] > 45) ? ("2H 45") : ("2H " + _rM[43]));
            else if (_rM[44] == 3)
                sb2.append((_rM[43] > 15) ? ("1E 15") : ("1E " + _rM[43]));
            else if (_rM[44] == 4)
                sb2.append((_rM[43] > 15) ? ("2E 15") : ("2E " + _rM[43]));
            sb2.append(strInjuryTime);
            sb2.append("</span>");
        }
        else {
            if (_rM[14]) {
                sb2.append((_rM[13] ? "" : ("<span class='" + (ACC_PreferedCulture.toUpperCase() == "EN-GB" ? "HeadingLIVE_ENGB" : "HeadingLIVE") + "'>" + RS_LIVE2 + "</span>")));
            }
        }

        sb2.append("</span>");
        //------------------------------ Time CONTENT
        sb2.append("</td>");

        //Home Away (Event)
        sb2.append("<td align='left' style='padding-left:5px; width:*;'>");
        sb2.append("<table width='100%' height='100%' cellpadding='0' cellspacing='0' border='0' class='StrStyleSoc'><tr>");

        sb2.append("<td align='left' style='width:*;'>");
        //------------------------------ Home Away (Event) CONTENT
        if (ACC_TeamView == 1) {
            //display Home -vs- Away
            sb2.append((_rM[45] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[45] + ".gif'>" : "");
            sb2.append("&nbsp;");

            visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
            if (visible)
                sb2.append("<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[4] + "</span>");

            sb2.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
            sb2.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
            sb2.append("&nbsp;<span class='Heading5'>-vs-</span>&nbsp;");

            visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
            if (visible)
                sb2.append("<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[5] + "</span>");

            sb2.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
            sb2.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));

            sb2.append("&nbsp;");
            sb2.append((_rM[46] > 0) ? "<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[46] + ".gif'>" : "");
        }
        else {
            visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
            if (visible)
                sb2.append("<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[4] + "</span>");

            sb2.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
            sb2.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[4] + "</span>" : ""));
            sb2.append((_rM[45] > 0) ? "&nbsp;<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[45] + ".gif'>" : "");
            sb2.append("<br>");
            //sb2.append("&nbsp;&nbsp;");

            visible = (_rM[15] && _rM[8] && pm_S[3] && SocOddsIsAvailable(_rM[18]));
            if (visible)
                sb2.append("<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "' >" + _rM[5] + "</span>");

            sb2.append(((_rM[8] && SocOddsIsAvailable(_rM[18]) && (!pm_S[3] || !_rM[15])) ? "<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
            sb2.append(((!_rM[8] || !SocOddsIsAvailable(_rM[18])) ? "<span class='" + (!_rM[7] && _rM[26] != 0 && _rM[26] != -1 ? (RS_LangClass + "Give") : (RS_LangClass + "Take")) + "'>" + _rM[5] + "</span>" : ""));
            sb2.append((_rM[46] > 0) ? "&nbsp;<img alt='' class='CssImgRC' src='../Images/redcard" + _rM[46] + ".gif'>" : "");
        }
        //------------------------------ Home Away (Event) CONTENT
        sb2.append("</td>");
        if (_rM[14]) {
            if (_rM[56] > 0 && !pm_S[4]) {
                sb2.append("<td width='15px' align='center' valign='middle'>");
                if (isMobileBrowser() || CFG_CompType == "12") { // API or Mobile Browser
                    sb2.append("<img src='../Images/tv.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer' onclick=\"showTVLarge('LiveTVGLS.aspx?Channel=" + _rM[56] + "&ClosingDate=" + _rM[55] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[80] + "&isShow=1&view=l'); \"" : "") + " />");
                }
                else {
                    sb2.append("<img src='../Images/tv.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer;' onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "')\"" : "") + "  />");
                    sb2.append("<div name='divTVMenu' id='divTVMenu" + key + "' class='SelMenu' style='width:70px; position:absolute; display:none;'>");
                    sb2.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "'); showTVLarge('LiveTVGLS.aspx?Channel=" + _rM[56] + "&ClosingDate=" + _rM[55] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[80] + "&isShow=1&view=l'); \" >" + RS_LargeView + "</span></div>");
                    sb2.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divTVMenu', 'divTVMenu" + key + "'); showTVSide('LiveTVGLS.aspx?Channel=" + _rM[56] + "&ClosingDate=" + _rM[55] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&mt=" + sjson(_LTitle) + "&pid=" + _rM[80] + "&isShow=1&view=s'); \" >" + RS_SideView + "</span></div>");
                    sb2.append("</div>");
                }
                sb2.append("</td>");
            }
            if (_rM[57] > 0) {
                sb2.append("<td width='15px' align='center' valign='middle'>");
                if (isMobileBrowser() || CFG_CompType == "12") { // API or Mobile Browser
                    sb2.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle'  " + (_isRun ? "style='cursor:pointer' onclick=\"showLCLarge('LiveCenterWithOdds.aspx?LCId=" + _rM[57] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=l'); \"" : "") + " />");
                }
                else {
                    sb2.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle' " + (_isRun ? "style='cursor:pointer;' onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "')\"" : "") + "  />");
                    sb2.append("<div name='divLCMenu' id='divLCMenu" + key + "' class='SelMenu' style='width:70px; position:absolute; display:none;'>");
                    sb2.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "'); showLCLarge('LiveCenterWithOdds.aspx?LCId=" + _rM[57] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=l'); \" >" + RS_LargeView + "</span></div>");
                    sb2.append("<div class='SelMenuItemBg'><span onclick=\"toggleMenu('divLCMenu', 'divLCMenu" + key + "'); showLCSide('LiveCenterWithOdds.aspx?LCId=" + _rM[57] + "&h=" + sjson(_rM[4]) + "&a=" + sjson(_rM[5]) + "&socOddsId=" + _rM[0] + "&isShow=1&view=s'); \" >" + RS_SideView + "</span></div>");
                    sb2.append("</div>");
                }
                sb2.append("</td>");
            }
        }
        else {
            if (_rM[56] > 0 && !pm_S[4]) {
                sb2.append("<td width='15px' align='center' valign='middle'>");
                sb2.append("<img src='../Images/tv.gif' border='0' align='absmiddle' />");
                sb2.append("</td>");
            }
            if (_rM[57] > 0) {
                sb2.append("<td width='15px' align='center' valign='middle'>");
                sb2.append("<img src='../Images/LiveCast.gif' border='0' align='absmiddle' />");
                sb2.append("</td>");
            }
        }
        sb2.append("<td width='15px' align='center'>");
        sb2.append("<a href='#' onclick=\"SetFavOneMM(this,'" + _ot + "');return false;\"><img fav='" + _rM[79] + "' src='.." + (_rM[79] == 1 ? "/Images/FavAdd.gif" : "/Images/FavOri.gif") + "' border='0' align='absmiddle'/></a>");
        sb2.append("</td>");

        sb2.append("</tr></table>");
        sb2.append("</td>");
    }
    else {
        sb2.append("<td>&nbsp;</td>"); //Time
        sb2.append("<td>&nbsp;</td>"); //Home Away (Event)
    }
    /*------------------------------ SAME Event appear once END ------------------------------*/

    //HDP
    sb2.append("<td align='Center' class='" + HDPBG + "' nowrap='nowrap' style='width:50px;'>");
    sb2.append("<span class='Heading8'>");
    sb2.append(_rM[8] ? UtilGetDisplayHdp(_rM[26]) : "");
    sb2.append("</span>");
    sb2.append("</td>");

    //HomeOdds
    sb2.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
    //------------------------------ Odds CONTENT
    //ReadOnly
    if (SocOddsIsAvailable(_rM[18]) && _rM[8] && (!_rM[15] || !pm_S[3]))
        sb2.append("<span class='" + (_rM[27] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[27]) + "</label>" + "</span>");
        //Betable
    else if (SocOddsIsAvailable(_rM[18]) && _rM[8] && _rM[15] && pm_S[3])
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[27] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'home', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[27]) + "</label>" + "</span>");
        //Hide
    else
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[27] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=home&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'home', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[27]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb2.append("</td>");

    //AwayOdds
    sb2.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
    //------------------------------ Odds CONTENT
    //ReadOnly
    if (SocOddsIsAvailable(_rM[18]) && _rM[8] && (!_rM[15] || !pm_S[3]))
        sb2.append("<span class='" + (_rM[28] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[28]) + "</label>" + "</span>");
        //Betable
    else if (SocOddsIsAvailable(_rM[18]) && _rM[8] && _rM[15] && pm_S[3])
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[28] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'away', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[28]) + "</label>" + "</span>");
        //Hide
    else
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[28] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=away&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'away', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[28]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb2.append("</td>");

    //OU
    sb2.append("<td align='Center' class='" + HDPBG + "' nowrap='nowrap' style='width:50px;'>");
    sb2.append("<span class='Heading8'>");
    sb2.append(_rM[9] ? UtilGetDisplayHdp(_rM[32]) : "");
    sb2.append("</span>");
    sb2.append("</td>");

    //OverOdds
    sb2.append("<td align='Center' nowrap='nowrap' style='width:65px;'>");
    //------------------------------ Odds CONTENT
    //ReadOnly
    if (SocOddsIsAvailable(_rM[22]) && _rM[9] && (!_rM[15] || !pm_S[3]))
        sb2.append("<span class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
        //Betable
    else if (SocOddsIsAvailable(_rM[22]) && _rM[9] && _rM[15] && pm_S[3])
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'over', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
        //Hide
    else
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[33] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=over&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'over', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[33]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb2.append("</td>");

    //UnderOdds
    sb2.append("<td align='Center' nowrap='nowrap' style='width:65px;' class='SEP'>");
    //------------------------------ Odds CONTENT
    //ReadOnly
    if (SocOddsIsAvailable(_rM[22]) && _rM[9] && (!_rM[15] || !pm_S[3]))
        sb2.append("<span class='" + (_rM[34] < 0 ? "NegOdds" : "PosOdds") + "'>" + "<label style='cursor:text;'>" + UtilGetDisplayOdds(_rM[34]) + "</label>" + "</span>");
        //Betable
    else if (SocOddsIsAvailable(_rM[22]) && _rM[9] && _rM[15] && pm_S[3])
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer;' class='" + (_rM[34] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'under', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[34]) + "</label>" + "</span>");
        //Hide
    else
        sb2.append("<span " + UtilGetTextDecorationJS() + " style='cursor:pointer; display:none;' class='" + (_rM[34] < 0 ? "NegOdds" : "PosOdds") + "' onclick=\"showBetBoxRU('JRecPanel.aspx?b=under&oId=" + _rM[0] + "&gType=" + _rM[51] + "&gType2=" + _rM[52] + "', " + key + ", 'under', '" + parOt + "'); \">" + "<label style='cursor:pointer;'>" + UtilGetDisplayOdds(_rM[34]) + "</label>" + "</span>");
    //------------------------------ Odds CONTENT
    sb2.append("</td>");

    if (_rM[6]) {
        sb2.append("<td align='center' nowrap='nowrap' style='width:20px;'>");
        sb2.append("<table border='0' width='100%' height='100%' cellpadding='1' cellspacing='0' class='StrStyleSoc'>");
        //Statistic
        if (_rM[54] > 0) {
            sb2.append("<tr><td align='center' valign='middle'>");
            sb2.append("<img src='../Images/Info.gif' border='0' align='absmiddle' style='cursor:pointer' onclick=\"window.open('" + CFG_StatsPath + "/" + _rM[54] + ".html', 'Statistic', 'width=1000,height=750,top=50,left=100,toolbars=no,scrollbars=yes,status=no,resizable=yes').focus();\" />");
            sb2.append("</td></tr>");
        }
        //More Bets
        sb2.append("<tr><td align='center' valign='middle'>");
        //sb2.append("<A title='More bets' onclick='_$MoreBets(this);' href='MoreBets2.aspx?ot=" + _ot + "&oId=" + _rM[0] + "&home=" + sjson2(_rM[4]) + "&away=" + sjson2(_rM[5]) + "&moduleTitle=" + sjson2(_LTitle) + "&date=" + _rM[3] + "&lang=" + pm_S[5] + "&isHomeGive=" + _rM[7] + "&workingDate=" + _rM[82] + "' target='_iMoreBets'><img src='../Images/MoreBets.gif' border='0' align='absmiddle' /></a>");
        sb2.append("<A title='More bets' style='cursor: pointer;' onclick=\"showMB('" + _rM[0] + "', '" + _FavId + "', '" + _ot + "', 'MoreBets2.aspx?ot=" + _ot + "&oId=" + _rM[0] + "&home=" + sjson2(_rM[4]) + "&away=" + sjson2(_rM[5]) + "&moduleTitle=" + sjson2(_LTitle) + "&date=" + _rM[3] + "&lang=" + pm_S[5] + "&isHomeGive=" + _rM[7] + "&workingDate=" + _rM[82] + "');\"><img src='../Images/MoreBets.gif' border='0' align='absmiddle' /></a>");
        sb2.append("</td></tr>");
        sb2.append("</table>");
        sb2.append("</td>");
    }
    else {
        sb2.append("<td align='center' nowrap='nowrap' style='width:20px;'>&nbsp;</td>");
    }

    //Remark
    //Myanmar Odds = SocOddsId + 'M' as oddsid
    //Normal Odds = SocOddsId as oddsid, preoddsid as SocOddsId + 'M'
    var _trMhtml1 = "";
    var _trMhtml2 = "";
    if (_IsMM) {
        _trMhtml1 = "<tr oddsid='" + _rM[0] + "M' preoddsid='" + _rM[83] + "' favid='" + _FavId + "' class='M_Item MMGridItem " + itemClass + "'>" + sb.toString() + "</tr>";
        _trMhtml2 = "<tr oddsid='" + _rM[0] + "' preoddsid='" + _rM[0] + "M' favid='" + _FavId + "' class='M_Item2 " + itemClass + "'>" + sb2.toString() + "</tr>";
    }
    else
        _trMhtml2 = "<tr oddsid='" + _rM[0] + "' preoddsid='" + _rM[83] + "' favid='" + _FavId + "' class='M_Item " + itemClass + "'>" + sb2.toString() + "</tr>";

    if (_IsNewL) {
        if (process == null) {
            _$tbL.append(_trMhtml1 + _trMhtml2);
        }
        else if (process != null && process == "1") {
            var _$oldTr = _$tbL.find("[oddsid='" + _rM[0] + "']");
            //To ensure that no duplicate odds will appear
            if (_$oldTr == null || _$oldTr.length <= 0) {
                _$tbL.append(_trMhtml1 + _trMhtml2);
            }
        }
    }
    else {
        var _$oldTr = _$tbL.find("[oddsid='" + _rM[0] + "']");
        var _$oldTrM = _$tbL.find("[oddsid='" + _rM[0] + "M']");

        //Add 
        if (_$oldTr == null || _$oldTr.length <= 0) {
            var _$preTm = _$tbL.find("[oddsid='" + _rM[83] + "']");
            var _$curTm;
            if (_$preTm == null || _$preTm.length <= 0) {
                _$curTm = _$tbL.find(".L_Name").parents("tr:first").after(_trMhtml1 + _trMhtml2);
            } else {
                var _$mbTm = _$preTm.next();
                if (_$mbTm.length > 0 && _$mbTm.hasClass('GridRM') && _$preTm.attr("favId") != _FavId)
                    _$curTm = _$mbTm.after(_trMhtml1 + _trMhtml2);
                else
                    _$curTm = _$preTm.after(_trMhtml1 + _trMhtml2);
            }
            var _$curtbL = _$curTm.parents("tbody[soclid]:first");
            adjTbMM(_$curtbL, true); //Adjust Row Color
        }
        //Update
        else {
            var _Oldtds = _$oldTr.clone().children();
            var _$newTrTm = _$oldTr;
            if (_IsMM)
                _$newTrTm.attr('preoddsid', _rM[0] + "M");
            else
                _$newTrTm.attr('preoddsid', _rM[83]);
            _$newTrTm.empty().append(sb2.toString());
            var _Newtds = _$newTrTm.children();

            //Compare with label value "odds"
            _Oldtds = _Oldtds.find('label');
            _Newtds = _Newtds.find('label');

            if (_Oldtds.length == _Newtds.length) {
                for (var i = 0, len = _Oldtds.length; i < len; i++) {
                    if (_Newtds[i].innerHTML != _Oldtds[i].innerHTML) {
                        $(_Newtds[i]).closest('td').addClass("NewOdds").css('background', "url(" + OddsBg + ")").attr("chgTms", 0);
                    }
                }
            }

            //MM parts
            if (_$oldTrM == null || _$oldTrM.length <= 0) {
                if (_IsMM) {
                    _$newTrTm.before(_trMhtml1);
                }
            }
            else {
                if (!_IsMM) {
                    _$oldTrM.remove();
                }
                else {
                    var _OldtdsM = _$oldTrM.clone().children();
                    var _$newTrTmM = _$oldTrM;
                    _$newTrTmM.attr('preoddsid', _rM[83]);
                    _$newTrTmM.empty().append(sb.toString());
                    var _NewtdsM = _$newTrTmM.children();

                    //Compare with label value "odds"
                    _OldtdsM = _OldtdsM.find('label');
                    _NewtdsM = _NewtdsM.find('label');

                    if (_OldtdsM.length == _NewtdsM.length) {
                        for (var i = 0, len = _OldtdsM.length; i < len; i++) {
                            if (_NewtdsM[i].innerHTML != _OldtdsM[i].innerHTML) {
                                $(_NewtdsM[i]).closest('td').addClass("NewOdds").css('background', "url(" + OddsBg + ")").attr("chgTms", 0);
                            }
                        }
                    }
                }
            }
        }
    }
};

function delM_S(_oddsid, _$tb, _ot) {
    var _$trM1 = _$tb.find("[oddsid='" + _oddsid + "M']"); //SocOddsId with 'M'
    var _$trM2 = _$tb.find("[oddsid='" + _oddsid + "']");
    var _$trMB = _$tb.find("[oddsid='" + _oddsid + "MB']");
    //alert(_oddsid);

    if (_$trM2.length > 0) {
        var _$tbL = _$trM2.parents("tbody:first");
        if (_$trM1.length > 0) //If Contain Myanmar odds, Remove It
            _$trM1.remove();
        if (_$trMB.length > 0) //If Contain MoreBets, Remove It
            _$trMB.remove();
        _$trM2.remove();
        _$tbL.children().length <= 1 && _$tbL.remove();
        adjTbMM(_$tbL, true); //Adjust Row Color
    }
    delDtM(_ot, _oddsid);
};

function closeMB(_ot) {
    var _$tb = $tb_S_R;
    if (_ot != 'r')
        _$tb = $tb_S_T;
    _$tb.find(".GridRM").remove();
}

function showMB(oid, favId, _ot, url) {
    var _$tb = $tb_S_R;
    if (_ot != 'r')
        _$tb = $tb_S_T;

    var _$tbA = $tb_S_R.parents("table:first");
    var _$trA = _$tbA.find("[oddsid]");
    var _$trA_MB = _$trA.nextAll('.GridRM:first');
    if (_$trA_MB.length > 0 && _$trA_MB.hasClass('GridRM'))
        _$trA_MB.remove();

    var _trMB = "<tr oddsid='" + oid + "MB' favid='" + favId + "' class='GridRM'><td colspan='9'><iframe id='ifMB' scrolling='no' frameBorder='0' src='" + url + "' width='767px' height='0px' style='display: block;' /></td></tr>";
    _$tb.find("tr[favid='" + favId + "']:last").after(_trMB);
}
