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
        return new Promise(resolve => resolve([]));
    }

    const result = [];
    let currentJob = 0;
    const initLen = jobs.length;
    const startJobs = jobs.splice(0, parallelNum);

    const runOnePromise = function (job, resolve, index) {
        new Promise((innerResolve) => {
            const jobPromise = job();
            const timeOutPromise = new Promise(() =>
                setTimeout(() => innerResolve(new Error('Promise timeout')), timeout)
            );
            Promise.race([jobPromise, timeOutPromise]).then(innerResolve, innerResolve);
        })
            .then(res => {
                result.push({ res, index });
                if (result.length === initLen) {
                    resolve(result
                        .sort((a, b) => a.index - b.index)
                        .map(obj => obj.res));
                } else if (jobs.length !== 0) {
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

module.exports = {
    runParallel,
    isStar
};
