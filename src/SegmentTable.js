import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Collapse from 'react-bootstrap/Collapse'
import IconTooltip from './IconTooltip'

class QuestTable extends React.Component {
    constructor(props) {
        super(props);

        var subsections_open = {}
        for (var i = 0; i < props.section.subsections.length; i++) {
            subsections_open[props.section.subsections[i]] = true
        }


        this.starting_index = this.props.quests[0].index;

        this.state = {
            section_open: true,
            subsections_open: subsections_open,
        }

    }

    renderSubsection(subsection, quests) {
        return (
            <div key={subsection}>
                <Button variant="outline-secondary" size="sm" block onClick={this.toggleSubsection(subsection).bind(this)}>
                    {subsection}
                </Button>
                <Collapse in={this.state.subsections_open[subsection]}>
                    {this.renderTable(quests)}
                </Collapse>
            </div>
        )
    }

    renderUnlocks(unlocks) {
        return unlocks.map(rew => (
                    <div key={rew.reward}>
                        {rew.reward_picture ?
                            <IconTooltip
                                size={24}
                                text={rew.reward}
                                icon={rew.reward_picture}
                                placement="left"
                                />
                             : ""}
                        <a href={rew.reward_link}>{rew.reward}</a>
                    </div>
                ))
    }

    renderTable(quests) {
        return (
            <Table striped bordered hover size="sm">
                <tbody>
                {
                    quests.map(q => (
                    <tr className={q.index < this.props.currentQuest ? "table-success" : (q.index === this.props.currentQuest ? "table-warning" : "")}
                            key={q.index} onClick={this.props.updateByRow(q.index)}>
                        <td style={{width: "50%"}} key={""+q.index+"quest"}><a href={q.quest_link}>{q.quest}</a></td>
                        <td style={{width: "5%"}} key={""+q.index+"level"}>{q.level}</td>
                        <td style={{width: "20%"}} key={""+q.index+"quest_giver"}><a href={q.giver_link}>{q.quest_giver}</a></td>
                        <td style={{textAlign: "left"}} key={""+q.index+"unlocks"}>{this.renderUnlocks(q.unlocks)}</td>
                    </tr>))
                }
                </tbody>
            </Table>
        )
    }

    toggleSection() {
        this.setState((state, props) => {
            return {
                section_open: !state.section_open
            }
        })
    }


    toggleSubsection(sub) {
        return function() {
            var newopen = this.state.subsections_open;
            newopen[sub] = !newopen[sub];
            this.setState((state, props) => {
                return {
                    subsection_open: newopen
                }
            })
        }
    }

    render() {
        // Handle the non-subsection case
        if (this.props.section.subsections.length === 0) {
            return (
            <div>
                <Button variant="secondary" block onClick={this.toggleSection.bind(this)}>
                    {this.props.section.name}
                </Button>
                <Collapse in={this.state.section_open}>
                    <div>
                        {this.renderTable(this.props.quests)}
                    </div>
                </Collapse>
            </div>
            )
        }

        // Special fun case for subsectioned sections
        return (
            <div>
                <Button variant="secondary" block onClick={this.toggleSection.bind(this)}>
                    {this.props.section.name}
                </Button>
                <Collapse in={this.state.section_open}>
                    <div>
                    {this.props.section.subsections.map(sub => (
                        this.renderSubsection(sub, this.props.quests.filter(q => (
                            q.subsection === sub
                        )))
                    ))}
                    </div>
                </Collapse>
            </div>
        )

    }
}

class SegmentTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            current_quest: 0,
            segment_open: true,
        }

    }

    toggleSegment() {
        this.setState({
            segment_open: !this.state.segment_open
        })
    }

    render() {
        return (
            <div id={this.props.questData.segment.toLowerCase().replace(/ /g,"-")}>
                <Button size="lg" block onClick={this.toggleSegment.bind(this)}>{this.props.questData.segment}</Button>
                <Collapse in={this.state.segment_open}>
                    <div>
                        {
                            this.props.questData.sections.map(sect => (
                                <QuestTable
                                    key={sect.name}
                                    quests={this.props.questData.quests.filter(q => q.section === sect.name)}
                                    section={sect}
                                    currentQuest={this.props.currentQuest}
                                    updateByRow={this.props.updateByRow} />
                            ))
                        }
                    </div>
                </Collapse>

            </div>

        )
    }
}

export default SegmentTable
