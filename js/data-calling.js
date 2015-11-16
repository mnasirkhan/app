
var _PROJECT_DIR_ = 'http://172.16.5.2/mobile/itmanager/';
var _DIR_TO_SERVER = _PROJECT_DIR_ + 'data-files/';
var _Login_DIR_TO_SERVER = _PROJECT_DIR_ + 'data-files/';

//var _URL = 'http://172.16.5.2/mobile/mgcc/api/';
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



myApp.onPageInit('outstanding-payables', function (page) {
    google.setOnLoadCallback(drawChart);
    drawChart();

});

var _URL = _DIR_TO_SERVER + 'erp.api/OutstandingPayables/getlist.json';
var graph_data = [];
var graph_data_year = [];
var graph_data_amount = [];
var graph_data_pending = [];
mgh_data_rows = '';


var chart;
var data;
var options;
var _payable_id = '';
var _receivable_id = 0;

function drawChart() {
    dataTable = google.visualization.arrayToDataTable([
        ['Party', 'Dated', 'Total Receivable', 'Pending'],
    ]);

    options = {
        title: 'Company Payable',
        hAxis: {title: 'Company Payable by Due date', titleTextStyle: {color: 'red'}}
    };

    chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(dataTable, options);

    _graph_data = '';
    _graph_data = [];
    _graph_data.push('Client');
//                _graph_data.push('Dated');
    _graph_data.push('Total Payable');
    _graph_data.push("Pending");
    graph_data.push(_graph_data);



    $.getJSON(_URL, function (data) {
        jQuery('#preloader').empty();

        $.each(data.outstandingPayables, function (i, row) {
            _row = [];
            customer_name = row['Customer']['name'];
            customer_payable_id = row['OutstandingPayable']['id'];
            customer_dated = row['OutstandingPayable']['dated'];
            customer_pending_amt = row['OutstandingPayable']['pending_amount'];
            customer_amt = row['OutstandingPayable']['total_amount'];

            customer_due_date = row['OutstandingPayable']['due_date'];
            customer_over_due_days = row['OutstandingPayable']['over_due_days'];
            tr = '<tr style="cursor:pointer" onClick="_payable_id='+customer_payable_id+'">\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_dated + '</a></td>\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_name + '</a></td>\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_amt + '</a></td>\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_pending_amt + '</a></td>\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_due_date + '</a></td>\n\
                        <td><a id="detail_'+customer_payable_id+'" href="outstanding-payable-details.html?payable=' + customer_payable_id + '">' + customer_over_due_days + '</a></td>\n\
</tr>';

            jQuery('#table_body').append(tr);

            c_date = customer_dated.split('/');
//                        console.log(c_date[2]);
//                        console.log(parseInt(c_date[2]), parseInt(c_date[1] ), parseInt(c_date[0]));

            _row.push(customer_name + '-' + customer_due_date);
            _row.push(parseInt(customer_amt));
            _row.push(parseInt(customer_pending_amt));

            graph_data.push(_row);
        });

        mnkDataTable = new google.visualization.DataTable();

//                    mnkDataTable.addColumn('date', 'Customer');
        var newData = graph_data;


        var numRows = newData.length;
        var numCols = newData[0].length;
console.log(numCols);
        mnkDataTable.addColumn('string', newData[0][0]);
        mnkDataTable.addColumn('number', newData[0][1]);
        mnkDataTable.addColumn('number', newData[0][2]);


//        for (var i = 1; i < numCols; i++) {
//            mnkDataTable.addColumn('number', newData[0][i]);
//        }

        // now add the rows.
        for (var i = 1; i < numRows; i++) {

            mnkDataTable.addRow(newData[i]);
        }

        // redraw the chart.
        chart.draw(mnkDataTable, options);
    });



}

myApp.onPageInit('outstanding-payable-details', function (page) {
    getPayableDetails();

});

function getPayableDetails() {
    var payable_id = _payable_id;
    //jQuery('.preloader').empty();
            var _URL = _DIR_TO_SERVER+'erp.api/OutstandingPayableDetails/getlist.json';
             $.getJSON(_URL, {payable_id: payable_id}, function(data) {
                 $.each(data.outstandingPayableDetails, function(i, row) {
                     customer_name = row['Customer']['name'];
                     customer_ref = row['OutstandingPayableDetail']['ref_no'];
                     customer_dated = row['OutstandingPayableDetail']['dated'];
                     customer_pending_amt = row['OutstandingPayableDetail']['pending_amount'];
                     customer_amt = row['OutstandingPayableDetail']['amount'];
                     customer_due_date = row['OutstandingPayableDetail']['due_date'];
                     customer_over_due_days = row['OutstandingPayableDetail']['over_due_days'];
                     tr = '<tr>\n\
                        <td>'+customer_dated+'</td>\n\\n\
                        <td>'+customer_name+'</td>\n\
                        <td>'+customer_amt+'</td>\n\
                        <td>'+customer_pending_amt+'</td>\n\
                        <td>'+customer_due_date+'</td>\n\
                        <td>'+customer_over_due_days+'</td>\n\
</tr>';
                     jQuery('#table_body_detail').append(tr);
                 });
             });
}



myApp.onPageInit('outstanding-receivable', function (page) {
    getReceivables();

});


function getReceivables() {
     var _URL = _DIR_TO_SERVER+'erp.api/OutstandingReceivables/getlist.json';
            var graph_data = [];
            var graph_data_year = [];
            var graph_data_amount = [];
            var graph_data_pending = [];
            mgh_data_rows = '';


            var chart;
            var data;
            var options;


                dataTable = google.visualization.arrayToDataTable([
                    ['Dated', 'Total Receivable', 'Pending'],
                ]);

                options = {
                    title: 'Company Receivable',
                    hAxis: {title: 'Company Receivable by Due date', titleTextStyle: {color: 'red'}}
                };

                chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                chart.draw(dataTable, options);

                _graph_data = [];
                _graph_data.push('Dated');
                _graph_data.push('Total Receivable');
                _graph_data.push("Pending");
                graph_data.push(_graph_data);

                $.getJSON(_URL, function(data) {

                    $.each(data.OutstandingReceivables, function(i, row) {
                        _row = [];
                        customer_name = row['Customer']['name'];
                        customer_payable_id = row['OutstandingReceivable']['id'];
                        customer_dated = row['OutstandingReceivable']['dated'];
                        customer_pending_amt = row['OutstandingReceivable']['pending_amount'];
                        customer_amt = row['OutstandingReceivable']['total_amount'];
                        customer_due_date = row['OutstandingReceivable']['due_date'];
                        customer_over_due_days = row['OutstandingReceivable']['over_due_days'];
                        
                        tr = '<tr style="cursor:pointer" onClick="_receivable_id='+customer_payable_id+'">'
                        +'<td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_dated + '</a></td>\n\
                        <td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_name + '</a></td>\n\
                        <td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_amt + '</a></td>\n\
                        <td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_pending_amt + '</a></td>\n\
                        <td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_due_date + '</a></td>\n\
                        <td><a href="outstanding-receivable-details.html?payable=' + customer_payable_id + '">' + customer_over_due_days + '</a></td>\n\
</tr>';
                        jQuery('#table_receivable_body').append(tr);
                        _row.push(""+customer_dated+"");
                        _row.push(parseInt(customer_amt));
                        _row.push(parseInt(customer_pending_amt));

                        graph_data.push(_row);
                    });

                     mnkDataTable = new google.visualization.DataTable();
                    var newData = graph_data;


                    var numRows = newData.length;
                    var numCols = newData[0].length;

                     mnkDataTable.addColumn('string', newData[0][0]);

                      for (var i = 1; i < numCols; i++) {
                          //console.log(newData[0][i]);
                          mnkDataTable.addColumn('number', newData[0][i]);
                      }


                // now add the rows.
                for (var i = 1; i < numRows; i++) {
                    mnkDataTable.addRow(newData[i]);
                }

                // redraw the chart.
                chart.draw(mnkDataTable, options);
            });
}


myApp.onPageInit('outstanding-receivable-details', function (page) {
    getReceivableDetail();

});
function getReceivableDetail() {
    var payable_id = _receivable_id;
    
            var _URL = _DIR_TO_SERVER+'erp.api/OutstandingReceivableDetails/getlist.json';
             $.getJSON(_URL, {payable_id: payable_id}, function(data) {
                 $.each(data.OutstandingReceivableDetails, function(i, row) {
                     customer_name = row['Customer']['name'];
                     customer_ref = row['OutstandingReceivableDetail']['ref_no'];
                     customer_dated = row['OutstandingReceivableDetail']['dated'];
                     customer_pending_amt = row['OutstandingReceivableDetail']['pending_amount'];
                     customer_amt = row['OutstandingReceivableDetail']['amount'];
                     customer_due_date = row['OutstandingReceivableDetail']['due_date'];
                     customer_over_due_days = row['OutstandingReceivableDetail']['over_due_days'];
                     tr = '<tr>\n\
                        <td>'+customer_dated+'</td>\n\\n\
                        <td>'+customer_name+'</td>\n\
                        <td>'+customer_amt+'</td>\n\
                        <td>'+customer_pending_amt+'</td>\n\
                        <td>'+customer_due_date+'</td>\n\
                        <td>'+customer_over_due_days+'</td>\n\
</tr>';
                     jQuery('#table_receivable_body_detail').append(tr);
                 });
             });
}

myApp.onPageInit('equipment-sales', function (page) {
    getEquipmentSale();

});

function getEquipmentSale() {
     var _URL = _DIR_TO_SERVER+'erp.api/SalesSummaries/getlist.json';
             $.getJSON(_URL, function(data) {    
                 $.each(data.SalesSummaries, function(i, row) {
                     category = row['SalesSummary']['category'];
                     open_balance_purchase = row['SalesSummary']['open_balance_purchase'];
                     open_balance_dept = row['SalesSummary']['open_balance_dept'];
                     
                     addition_balance_purchase = row['SalesSummary']['addition_balance_purchase'];
                     addition_balance_dept = row['SalesSummary']['addition_balance_dept'];
                     
                     deletion_sales_value = row['SalesSummary']['deletion_sales_value'];
                     deletion_dept_value = row['SalesSummary']['deletion_dept_value'];
                     
                     closing_banalce_value = row['SalesSummary']['closing_banalce_value'];
                     closing_banalce_dept = row['SalesSummary']['closing_banalce_dept'];
                     
                     w_d_value = row['SalesSummary']['w_d_value'];

                     tr = '<tr>'                                                   
                       +'<td style="border: 1px solid #333"><h3>'+category+'</h3>'
                    +'<table cellpadding=0 cellspacing=0 width="100%">\n\
<tr><td>'
                    +'<table cellpadding=0 cellspacing=0 width="100%" style="border-right: 1px solid #333;">'
                    +'<th style="background: #333;color: white" colspan=3>Opening</th>'
                    +'<tr>' 
                    +'<th>Pur.Val</th>'
                            +'<th>Dept</th>'
                        +'</tr>'
                        +'<tr>'
                            +'<td  style="border-right: 1px solid #333;  ">'+open_balance_purchase+'</td>'
                            +'<td >&nbsp;'+open_balance_dept+'</td>'
                        +'</tr>'
                    +'</table>'
                    +'<table cellpadding=0 cellspacing=0 width="100%"  style="border-right: 1px solid #333;border-bottom: 1px solid #333;">'
                    +'<tr><th style="background: #333;color: white" colspan=2>Additions</th></tr>'
            
                    +'<th>Pur.Val</th>'
                            +'<th>Dept</th>'
                        +'</tr>'
                        +'<tr>'
                            +'<td style="border-right: 1px solid #333;  ">'+addition_balance_purchase+'</td>'
                            +'<td>&nbsp;'+addition_balance_dept+'</td>'
                        +'</tr>'
                    +'</table>'                    
                    +'</td>'
//                    +'<td>'                    
//                    +'</td>'                    
//                    +'<td>'                    
//                    +'</td>'                    
                    +'<td>'
                    +'<table cellpadding=0 cellspacing=0 width="100%">'
                    
                    +'<tr><th style="background: #333;color: white" colspan=2>Deletions</th></tr>'
                    +'<th>Sale.Val</th>'
                            +'<th>Dept.</th>'
                        +'</tr>'
                        +'<tr>'
                            +'<td style="border-right: 1px solid #333;  ">'+deletion_sales_value+'</td>'
                            +'<td>&nbsp;'+deletion_dept_value+'</td>'
                        +'</tr>'
                    +'</table>'
                    +'<table cellpadding=0 cellspacing=0 width="100%" style="border-bottom: 1px solid #333;">'                    
                    +'<tr><th style="background: #333;color: white" colspan=2>Closing</th></tr>'
                    +'<th>Cl.Val</th>'
                            +'<th>Dept.</th>'
                        +'</tr>'
                        +'<tr>'
                            +'<td style="border-right: 1px solid #333;  ">'+closing_banalce_value+'</td>'
                            +'<td>&nbsp;'+closing_banalce_dept+'</td>'
                        +'</tr>'
                    +'</table>'
                    +'</td>'
                    +'</td></tr></table>\n\
<div align="right"><strong>W.D Val:</strong> '+w_d_value+'</div></td></td>'
                     //+'<td>'+w_d_value+'</td>\n\\n\
+'</tr>';
                     jQuery('#table_body_sales').append(tr);
                 });
             });
}