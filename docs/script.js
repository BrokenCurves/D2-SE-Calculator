class Scene {
    constructor(inner, outer) {
        this.inner = inner;
        this.outer = [outer.slice(0, 2), outer.slice(2, 4), outer.slice(4, 6)];
        this.goal = [this.calculateGoal(0), this.calculateGoal(1), this.calculateGoal(2)];
        this.positionMap = { 0: '左', 1: '中', 2: '右' };
        this.shapeMap = { '3': '三角形', '4': '正方形', '0': '圆' };
    }

    calculateGoal(index) {
        let otherNums = new Set(['3', '4', '0']);
        otherNums.delete(this.inner[index]);
        return Array.from(otherNums).sort().join('');
    }

    isGoal() {
        return this.outer.every((pair, i) => pair.split('').sort().join('') === this.goal[i]);
    }

    swap(i, j, a, b) {
        let newOuter = this.outer.map(pair => pair.split(''));
        let indexI = newOuter[i].indexOf(a);
        let indexJ = newOuter[j].indexOf(b);
        [newOuter[i][indexI], newOuter[j][indexJ]] = [newOuter[j][indexJ], newOuter[i][indexI]];
        return newOuter.map(pair => pair.join(''));
    }

    bfs() {
        let queue = [[this.outer, []]];
        let seen = new Set();
        seen.add(JSON.stringify(this.outer));

        while (queue.length) {
            let [currentOuter, path] = queue.shift();
            this.outer = currentOuter;
            if (this.isGoal()) return path;

            for (let i = 0; i < 3; i++) {
                for (let j = i + 1; j < 3; j++) {
                    for (let a of currentOuter[i]) {
                        for (let b of currentOuter[j]) {
                            let newOuter = this.swap(i, j, a, b);
                            let newOuterString = JSON.stringify(newOuter);
                            if (!seen.has(newOuterString)) {
                                seen.add(newOuterString);
                                queue.push([newOuter, path.concat([[i, a, j, b]])]);
                            }
                        }
                    }
                }
            }
        }
        return null;
    }
}

function calculateSteps() {
    let innerState = document.getElementById('innerState').value;
    let outerState = document.getElementById('outerState').value;
    let scene = new Scene(innerState, outerState);
    let path = scene.bfs();
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    if (path) {
        resultDiv.innerHTML = 'Steps to reach the goal:<br>';
        path.forEach(step => {
            let pos1 = scene.positionMap[step[0]];
            let shape1 = scene.shapeMap[step[1]];
            let pos2 = scene.positionMap[step[2]];
            let shape2 = scene.shapeMap[step[3]];
            resultDiv.innerHTML += `${pos1} ${shape1} ↔ ${pos2} ${shape2}<br>`;
        });
    } else {
        resultDiv.innerHTML = 'No solution found';
    }
}
