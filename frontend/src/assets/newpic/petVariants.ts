import stardustFennec from './stardust-fennec.png'
import encouraging from './expressions/encouraging.png'
import happy from './expressions/happy.png'
import sleepy from './expressions/sleepy.png'
import adult from './growth/adult.png'
import baby from './growth/baby.png'
import young from './growth/young.png'
import softFluffy from './textures/soft-fluffy.png'
import stardustGlow from './textures/stardust-glow.png'

export const petVariants = {
  default: stardustFennec,
  expression: {
    encouraging,
    happy,
    sleepy,
  },
  growth: {
    adult,
    baby,
    young,
  },
  texture: {
    softFluffy,
    stardustGlow,
  },
} as const
