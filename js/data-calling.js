var get_response_from = 'http://www.mgcc.ae/mobile/';
var live_dir_link = 'http://www.mgcc.ae/mobile/';
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
    


    
                _graph_data = [];
                _graph_data.push('Client');
//                _graph_data.push('Dated');
                _graph_data.push('Total Payable');
                _graph_data.push("Pending");
                graph_data.push(_graph_data);
                
                
                
                $.getJSON(_URL, function(data) {
                
                    jQuery('#table_body').empty();
                    $.each(data.outstandingPayables, function(i, row) {
                        _row = [];
                        customer_name = row['Customer']['name'];
                        customer_payable_id = row['OutstandingPayable']['id'];
                        customer_dated = row['OutstandingPayable']['dated'];
                        customer_pending_amt = row['OutstandingPayable']['pending_amount'];
                        customer_amt = row['OutstandingPayable']['total_amount'];
                        customer_due_date = row['OutstandingPayable']['due_date'];
                        customer_over_due_days = row['OutstandingPayable']['over_due_days'];
                        tr = '<tr style="cursor:pointer" onClick="window.location=\'outstanding-payable-details.html?payable=' + customer_payable_id + '\'">\n\
                        <td>' + customer_dated + '</td>\n\
                        <td>' + customer_name + '</td>\n\
                        <td>' + customer_amt + '</td>\n\
                        <td>' + customer_pending_amt + '</td>\n\
                        <td>' + customer_due_date + '</td>\n\
                        <td>' + customer_over_due_days + '</td>\n\
</tr>';
                        
                        jQuery('#table_body').append(tr);
                        
                        c_date = customer_dated.split('/');
//                        console.log(c_date[2]);
//                        console.log(parseInt(c_date[2]), parseInt(c_date[1] ), parseInt(c_date[0]));
                        
                        _row.push( customer_name+'-'+ customer_due_date);
                        _row.push(parseInt(customer_amt));
                        _row.push(parseInt(customer_pending_amt));

                        graph_data.push(_row);
                    });

                    mnkDataTable = new google.visualization.DataTable();
                    
//                    mnkDataTable.addColumn('date', 'Customer');
                    var newData = graph_data;

                    
                    var numRows = newData.length;
                    var numCols = newData[0].length;
                    
                    mnkDataTable.addColumn('string', newData[0][0]);
//                    mnkDataTable.addColumn('date', new Date(newData[0][1]));
                    
//                    console.log(newData);
//                    var formatter_short = new google.visualization.DateFormat({formatType: 'short'});
//                    formatter_short.format(newData, newData[0][1]);
                    
                    for (var i = 1; i < numCols; i++) {                        
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

     