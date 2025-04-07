var TARGET_TIME = 3.0;
var startTime;
var attempts = [];
var chart = null;

var mainBtn = document.getElementById('main-btn');
var resultDiv = document.getElementById('result');
var historyBody = document.getElementById('history-body');

mainBtn.addEventListener('click', function() {
    if (mainBtn.textContent === 'Start') {
        startTime = new Date();
        mainBtn.textContent = 'Stop';
        mainBtn.classList.remove('btn-primary');
        mainBtn.classList.add('btn-danger');
        resultDiv.classList.add('hidden');
    } else {
        var endTime = new Date();
        var elapsed = (endTime - startTime) / 1000;
        var diff = elapsed - TARGET_TIME;
        var absDiff = Math.abs(diff);

        var resultClass = absDiff === 0 ? 'perfect' :
            absDiff <= 0.2 ? 'good' :
                absDiff <= 0.5 ? 'fair' : 'bad';

        attempts.push({
            number: attempts.length + 1,
            time: elapsed,
            diff: diff,
            resultClass: resultClass
        });

        mainBtn.textContent = 'Start';
        mainBtn.classList.remove('btn-danger');
        mainBtn.classList.add('btn-primary');

        resultDiv.className = 'result-box rounded ' + resultClass;
        resultDiv.innerHTML = '<div class="time-display">' + elapsed.toFixed(3) + ' seconds</div>' +
            '<div class="diff-display">(' + diff.toFixed(3) + ' from target)</div>';
        resultDiv.classList.remove('hidden');

        updateHistory();
        updateStats();
        updateChart();
    }
});

function updateHistory() {
    historyBody.innerHTML = '';
    for (var i = 0; i < attempts.length; i++) {
        var row = document.createElement('tr');
        row.className = attempts[i].resultClass;
        row.innerHTML = '<td>' + attempts[i].number + '</td>' +
            '<td>' + attempts[i].time.toFixed(3) + '</td>' +
            '<td>' + attempts[i].diff.toFixed(3) + '</td>';
        historyBody.appendChild(row);
    }
}

function updateStats() {
    if (attempts.length === 0) return;

    var times = attempts.map(function(a) { return a.time; });
    var diffs = times.map(function(t) { return Math.abs(t - TARGET_TIME); });

    document.getElementById('total').textContent = attempts.length;
    document.getElementById('best').textContent = Math.min.apply(Math, diffs).toFixed(3);
    document.getElementById('worst').textContent = Math.max.apply(Math, diffs).toFixed(3);
    document.getElementById('average').textContent =
        (times.reduce(function(a, b) { return a + b; }, 0) / times.length).toFixed(3);
}

function updateChart() {
    var ctx = document.getElementById('chart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: attempts.map(function(a) { return a.number; }),
            datasets: [{
                label: 'Your Time',
                data: attempts.map(function(a) { return a.time; }),
                backgroundColor: attempts.map(function(a) {
                    if (a.resultClass === 'perfect') return '#28a745';
                    if (a.resultClass === 'good') return '#17a2b8';
                    if (a.resultClass === 'fair') return '#ffc107';
                    return '#dc3545';
                }),
                borderColor: '#333',
                borderWidth: 1
            }, {
                label: 'Target',
                data: Array(attempts.length).fill(TARGET_TIME),
                type: 'line',
                borderColor: '#6c757d',
                borderWidth: 2,
                borderDash: [5,5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

['history', 'stats', 'chart'].forEach(function(section) {
    document.getElementById('toggle-' + section).addEventListener('click', function() {
        document.getElementById(section + '-section').classList.toggle('hidden');
    });
});