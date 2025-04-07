var TARGET_TIME = 3.0;
var startTime;
var attempts = [];
var chart = null;

// Get DOM elements
var mainBtn = document.getElementById('main-btn');
var resultDiv = document.getElementById('result');
var historyBody = document.getElementById('history-body');

// Main button click handler
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
        resultDiv.innerHTML = '<div class="time-display fw-bold">' + elapsed.toFixed(3) + ' seconds</div>' +
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
        var attempt = attempts[i];
        var row = document.createElement('tr');
        row.className = attempt.resultClass;
        row.innerHTML = '<td>' + attempt.number + '</td>' +
            '<td>' + attempt.time.toFixed(3) + '</td>' +
            '<td>' + attempt.diff.toFixed(3) + '</td>';
        historyBody.appendChild(row);
    }
}

function updateStats() {
    if (attempts.length === 0) return;

    var times = [];
    for (var i = 0; i < attempts.length; i++) {
        times.push(attempts[i].time);
    }

    var diffs = [];
    for (var j = 0; j < times.length; j++) {
        diffs.push(Math.abs(times[j] - TARGET_TIME));
    }

    document.getElementById('total').textContent = attempts.length;
    document.getElementById('best').textContent = Math.min.apply(Math, diffs).toFixed(3);
    document.getElementById('worst').textContent = Math.max.apply(Math, diffs).toFixed(3);
    document.getElementById('average').textContent =
        (times.reduce(function(a, b) { return a + b; }, 0) / times.length).toFixed(3);
}

function updateChart() {
    var ctx = document.getElementById('chart').getContext('2d');
    if (chart) chart.destroy();

    var labels = [];
    var data = [];
    var backgroundColors = [];

    for (var i = 0; i < attempts.length; i++) {
        labels.push(attempts[i].number);
        data.push(attempts[i].time);

        if (attempts[i].resultClass === 'perfect') {
            backgroundColors.push('#28a745');
        } else if (attempts[i].resultClass === 'good') {
            backgroundColors.push('#17a2b8');
        } else if (attempts[i].resultClass === 'fair') {
            backgroundColors.push('#ffc107');
        } else {
            backgroundColors.push('#dc3545');
        }
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Time',
                data: data,
                backgroundColor: backgroundColors,
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

// Initialize toggle buttons
['history', 'stats', 'chart'].forEach(function(section) {
    document.getElementById('toggle-' + section).addEventListener('click', function() {
        document.getElementById(section + '-section').classList.toggle('hidden');
    });
});