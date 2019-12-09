'use strict';

/**
 * Сделано задание на звездочку.
 * Реализована остановка промиса по таймауту.
 */
const isStar = true;

/**
 * Функция паралелльно запускает указанное число промисов
 *
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    if (jobs.length === 0) {
        return Promise.resolve(jobs);
    }

    const result = new Array(jobs.length);
    let currentJob = 0;
    const startJobs = jobs.splice(0, parallelNum);

    const processJob = function (resolve, res, index) {
        result[index] = res;
        if (!hasEmptySlot(result)) {
            resolve(result);
        }
    };

    const runOnePromise = function (job, resolve, index) {
        let timeOutPromise = new Promise((timeOutResolve) =>
            setTimeout(() => timeOutResolve(new Error('Promise timeout')), timeout)
        );
        Promise.race([job(), timeOutPromise])
            .then(res => {
                processJob(resolve, res, index);
            }, res => {
                processJob(resolve, res, index);
            })
            .finally(() => {
                if (jobs.length !== 0) {
                    runOnePromise(jobs.shift(), resolve, currentJob++);
                }
            });
    };

    return new Promise((resolve) => {
        startJobs.forEach((job) => {
            runOnePromise(job, resolve, currentJob++);
        });
    });
}

function hasEmptySlot(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) {
            return true;
        }
    }

    return false;
}

module.exports = {
    runParallel,
    isStar
};
