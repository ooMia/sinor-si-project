import * as Icons from './icons';

function SvgIcon({
  name,
  fill = 'none',
  width: _width,
  height: _height,
  size,
  ...props
}) {
  const Comp = Icons[name];
  // `width`, `height` 를 따로 지정할 수 있지만
  // 아이콘은 보통 가로 세로 값이 같은 정사각형 형식이기 때문에
  // 여기서는 `size` 를 사용해 너비와 높이를 같이 지정할 수 있게 해주었다.
  const width = _width ?? size;
  const height = _height ?? size;
  const sizeProps = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  };

  return <Comp {...props} fill={fill} {...sizeProps} />;
}

export default SvgIcon;
