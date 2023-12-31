import { SpanText } from "../../../Components/Texts";
import { formatPlaytimeDuration } from "../../../Helpers";
import { IMediaPlayerControls } from "../MediaProgressBar";

export default function MediaPlayDuration(props: IMediaPlayerControls) {
    const { hidden, states: { duration, position, bufferProgress, progress, playState } } = props

    return (
        <SpanText
            hidden={!duration}
            style={{ fontSize: 10, padding: 0, color: 'white' }}  >
            {formatPlaytimeDuration(position)}/{formatPlaytimeDuration(duration)}
        </SpanText>
    )
}