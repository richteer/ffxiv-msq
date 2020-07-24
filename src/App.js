import React from 'react';
import './App.css';
// TODO: Change to another style maybe
import 'bootstrap/dist/css/bootstrap.min.css';
//import './bootstrap-darkly.min.css';
//import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.min.css';

import quest_data from './quest_data.json';
import image_data from './image_data.json';
import SegmentTable from './SegmentTable'
import QuestProgressMeter from './QuestProgressMeter'

//import Row from 'react-bootstrap/Row'
//import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import {Helmet} from 'react-helmet'
import KeyboardEventHandler from 'react-keyboard-event-handler';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            current_quest: 0,
            current_segment: quest_data[0],
        }

        // Use the last quest's index # as the max quests
        var lastseg = quest_data[quest_data.length-1].quests
        this.max_quests = lastseg[lastseg.length-1].index
        //quest_data.forEach(e => this.max_quests += e.quests.length)
    }

    componentDidMount() {
        const cur = parseInt(localStorage.getItem("current_quest"))

        if ((!isNaN(cur)) && (cur !== 0)) {
            this.setQuest(cur)
        }
    }

    getCurrentSegment(quest) {
        var seg
        for (var i = 0; i < quest_data.length; i++) {
            seg = quest_data[i]
            if ((quest >= seg.quests[0].index) &&
                (quest <= seg.quests[seg.quests.length-1].index)) {
                    return seg
            }
        }

        console.log("bad things happened getting segment")
    }

    setQuest(newval) {
        localStorage.setItem("current_quest", newval)
        this.setState({
            current_quest: newval,
            current_segment: this.getCurrentSegment(newval),
        })
    }

    setQuestByInput(event) {
        this.setQuest(parseInt(event.target.value))
    }

    setQuestByRow(quest_num) {
        // Weird hack to make it work
        var foo = this
        return function (event) {
            if (quest_num === foo.state.current_quest) {
                quest_num += 1
            }
            foo.setQuest(quest_num)
        }
    }

    render() {
        return (
            <div className="App">
                <KeyboardEventHandler
                    handleKeys={["left", "up", "w", "a", ]}
                    onKeyEvent={(key, event) => this.setQuest(this.state.current_quest-1)} />
                <KeyboardEventHandler
                    handleKeys={["right", "down", "s", "d"]}
                    onKeyEvent={(key, event) => this.setQuest(this.state.current_quest+1)} />
                <Helmet>
                    <title>MSQ Tracker</title>
                    <link rel="icon" type="image/png" href={image_data["ffxiv-msq-quest.png"]} sizes="16x16" />
                </Helmet>
                <QuestProgressMeter
                    maxQuests={this.max_quests}
                    currentQuest={this.state.current_quest}
                    currentSegment={this.state.current_segment}
                    questData={quest_data}/>
                <Container>
                    {
                        quest_data.map(segment => (
                            <div key={segment.segment}>
                                    <SegmentTable
                                        questData={segment}
                                        currentQuest={this.state.current_quest}
                                        updateByRow={this.setQuestByRow.bind(this)} />
                            </div>
                        ))
                    }
                </Container>
            </div>
        );
    };
}

export default App;
