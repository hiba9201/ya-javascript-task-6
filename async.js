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

    const processJob = function (resolve, res, index) {
        result[index] = res;
        if (!hasEmptySlot(result)) {
            resolve(result);
        }
    };

    const runOnePromise = function (resolve, index) {
        const timeOutPromise = new Promise((timeOutResolve) =>
            setTimeout(() => timeOutResolve(new Error('Promise timeout')), timeout)
        );
        Promise.race([jobs[index](), timeOutPromise])
            .then(res => {
                processJob(resolve, res, index);
            }, res => {
                processJob(resolve, res, index);
            })
            .finally(() => {
                if (index < jobs.length - 1) {
                    runOnePromise(resolve, ++index);
                }
            });
    };

    return new Promise((resolve) => {
        for (let i = 0; i < parallelNum; i++) {
            runOnePromise(resolve, i);
        }
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
