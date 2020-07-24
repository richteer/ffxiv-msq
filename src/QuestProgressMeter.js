import React from 'react';
import './App.css';
//import ProgressBar from 'react-bootstrap/ProgressBar'
import Sticky from 'react-stickynode'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'

import IconTooltip from './IconTooltip'
import "react-step-progress-bar/styles.css";
import  {ProgressBar as StepProgressBar, Step as ProgressStep}  from "react-step-progress-bar";


class QuestProgressMeter extends React.Component {
	constructor(props) {
		super(props)
		this.segmentMap = props.questData.map(seg => (
			{start: seg.quests[0].index, name: seg.segment, icon: seg.segmenticon}
		))
	}

	getSegmentLabel(seg, quest) {
		var curr = quest - seg.quests[0].index
		var end = seg.quests[seg.quests.length-1].index - seg.quests[0].index

		return "" + curr
			+ " / "
			+ end
	}

	getRewardingQuests(seg) {
		var ret = []
		var quests = seg.quests.filter(q =>
			q.unlocks.length !== 0
			&&
			q.unlocks.filter(
				r => r.reward_picture !== ""
			).length !== 0
		)
		quests.forEach(e => {
			if (e.unlocks.filter(r => r.reward_picture !== "").length !== 0) {
				ret.push(e)
			}
		})

		ret.forEach(elem => {
			//console.log(elem.quest + " @ " + this.getSegmentPercent(seg, elem.index))
		})

		return ret
	}

	getSegmentPercent(seg, quest) {
		var start = seg.quests[0].index
		var end = seg.quests[seg.quests.length-1].index

		return ((quest - start) / (end - start)) * 100
	}

	getStepPositions(seg) {
		return this.getRewardingQuests(seg).map(q => this.getSegmentPercent(seg, q.index))
	}

	getIcon(state, quest) {
		var seg = this.props.questData[state.index] // Segment of icon to render
		if (quest < seg.quests[0].index)
			return "ffxiv-msq-quest.png"
		if (quest < seg.quests[seg.quests.length-1].index)
			return "ffxiv-msq-next.png"
		return "ffxiv-msq-complete.png"

	}

	render() {
		return (
			<Sticky>
				<Container fluid>
				<div style={{background: "rgba(255,255,255,0.8)"}}>
					<Row>
						<Col className="align-self-center" sm="auto">
							<div style={{fontSize: "20px"}}>
							{"Overall MSQ: " + this.props.currentQuest + " / " + this.props.maxQuests}
							</div>
						</Col>
						{/*<Col sm="auto">
							{Math.floor(this.props.currentQuest / this.props.maxQuests)}%
						</Col>*/}
						<Col>
							<StepProgressBar
								percent={(this.props.currentQuest / this.props.maxQuests) * 100}
								height={32}
								stepPositions={this.segmentMap.map(e => (e.start / this.props.maxQuests)*100)}
								filledBackground="linear-gradient(to right, #094a79, #00d4ff)">
								{
									this.segmentMap.map(seg => (
										<ProgressStep key={"msq-step-" +seg.name}>
										{(s) => (
											<a href={"#" + seg.name.toLowerCase().replace(/ /g, "-")}>
											<IconTooltip
												key={"msq-step-rew-"+seg.name}
												icon={
													this.getIcon(s, this.props.currentQuest)
												}
												text={seg.name}
												size={30}/>
											</a>
										)}
										</ProgressStep>
									))
								}
							</StepProgressBar>
						</Col>
					</Row>
					<Row>
						<Col className="align-self-center" sm="auto">
							<div style={{fontSize: "16px"}}>
							{"" + this.props.currentSegment.segment
								+ ": " + this.getSegmentLabel(this.props.currentSegment, this.props.currentQuest)}
							</div>
						</Col>
						{/*<Col sm="auto">
							{Math.floor(this.getSegmentPercent(this.props.currentSegment, this.props.currentQuest))}%
						</Col>*/}
						<Col className="align-self-center">
							<StepProgressBar
								percent={this.getSegmentPercent(this.props.currentSegment, this.props.currentQuest)}
								height={20}
								stepPositions={this.getStepPositions(this.props.currentSegment)}
								filledBackground="linear-gradient(to right, #fefb72, #f0bb31)">
							{
								this.getRewardingQuests(this.props.currentSegment).map(quest => (
								<ProgressStep key={"seg-prog-"+quest.index+quest.subsection}
									>
									{(s) => (
										<div hidden={s.position < this.getSegmentPercent(this.props.currentSegment, this.props.currentQuest)}>
											{
												quest.unlocks.filter(u => u.reward_picture !== "").map(q => (
													<IconTooltip
														key={"seg-prog-icon-" + q.reward}
														icon={q.reward_picture}
														text={q.reward}
														size={24}
														/>
												))
											}
										</div>
									)}
								</ProgressStep>
							))}
							</StepProgressBar>
						</Col>
					</Row>
				</div>

				{/*<Row noGutters>
					<Col sm={1} className="text-right align-middle">
						<h3>Overall MSQ:</h3>
					</Col>
					<Col sm>
						<ProgressBar
								min={0}
								max={this.props.maxQuests}
								now={this.props.currentQuest}
								style={{height: "32px"}}
								variant="primary"
								label={"" + (this.props.currentQuest) + "/" + (this.props.maxQuests)}>
						</ProgressBar>
					</Col>
				</Row>
				<Row noGutters>
					<Col sm={1} style={{"textAlign": "right"}}>
						<h3>Story Segment:</h3>
					</Col>
					<Col sm>
						<ProgressBar
								min={this.props.currentSegment.quests[0].index}
								max={this.props.currentSegment.quests[this.props.currentSegment.quests.length-1].index}
								now={this.props.currentQuest}
								style={{height: "32px"}}
								variant="info"
								label={this.getSegmentLabel(this.props.currentSegment, this.props.currentQuest)}>
						</ProgressBar>
					</Col>
				</Row>*/}
			</Container>
			</Sticky>

		)

	}
}

export default QuestProgressMeter
