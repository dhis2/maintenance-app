function swapStages(stageA, stageB) {
    this.setState((state) => {
        const swapOrder = stageA.sortOrder;
        stageA.sortOrder = stageB.sortOrder; // eslint-disable-line
        stageB.sortOrder = swapOrder; // eslint-disable-line
        return {
            sections: state.stages.sort((a, b) => a.sortOrder - b.sortOrder),
        };
    });
}

contextActionChecker = (model, action) => {
    if (action === 'move_up') {
        return this.state.stages.indexOf(model) > 0;
    } else if (action === 'move_down') {
        return this.state.stages.indexOf(model) < this.state.stages.length - 1;
    }
    return true;
};

moveStageUp = (stage) => {
    const currentIndex = this.state.stages.indexOf(stage);
    if (currentIndex > 0) {
        const swapStage = this.state.stages[currentIndex - 1];
        this.swapStages(swapStage, stage);
    }
}

moveStageDown = (stage) => {
    const currentIndex = this.state.stages.indexOf(stage);
    if (currentIndex < this.state.stages.length - 1) {
        const swapStage = this.state.stages[currentIndex + 1];
        this.swapStages(swapStage, stage);
    }
}