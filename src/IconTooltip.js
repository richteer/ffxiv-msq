import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import image_data from './image_data.json';


class IconTooltip extends React.Component {
	render() {
		return (
				<OverlayTrigger
					placement={this.props.placement?this.props.placement:"bottom"}
					overlay={
						<Tooltip>
							{this.props.text}
						</Tooltip>
					}
					>
					<img src={image_data[this.props.icon]}
						alt={this.props.text}
						width={this.props.size}
						height={this.props.size}
						/>
				</OverlayTrigger>
		)
	}
}

export default IconTooltip
